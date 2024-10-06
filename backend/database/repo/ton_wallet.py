from sqlalchemy import select

from backend.classes.ton.encryption_controller import encryption_manager
from backend.database.schema.ton_wallet import TonWallet


class TonWalletRepository:
    def __init__(self, session_local):
        self.session_local = session_local

    async def add_wallet(
            self,
            user_id: int,
            mnemonics: list[str],
            name: str,
            selected=False
    ) -> TonWallet:
        encrypted_mnemonic = encryption_manager.encrypt('_'.join(mnemonics))

        async with self.session_local() as session:
            wallet = TonWallet(
                user_id=user_id,
                mnemonics=encrypted_mnemonic,
                name=name,
                selected=selected
            )

            session.add(wallet)
            await session.commit()

            return wallet

    async def get_selected_wallet(self, user_id: int) -> TonWallet:
        async with self.session_local() as session:
            result = await session.execute(
                select(TonWallet).filter_by(user_id=user_id, selected=True)
            )

            ton_wallet = result.scalar()

            if ton_wallet:
                decrypted_mnemonic = encryption_manager.decrypt(ton_wallet.mnemonics).split('_')
                ton_wallet.mnemonics = decrypted_mnemonic
                return ton_wallet

            return None

    async def get_selected_wallets(self, user_ids: list[int]) -> list[TonWallet]:
        async with self.session_local() as session:
            result = await session.execute(
                select(TonWallet).filter(TonWallet.user_id.in_(user_ids), TonWallet.selected == True)
            )

            wallets = result.scalars().all()

            for wallet in wallets:
                decrypted_mnemonic = encryption_manager.decrypt(wallet.mnemonics).split('_')
                wallet.mnemonics = decrypted_mnemonic

            return wallets

    async def get_wallets_by_user_id(self, user_id):
        async with self.session_local() as session:
            wallets_record = session.query(TonWallet).filter_by(user_id=user_id).all()
            return

    async def get_wallet_by_id(self, wallet_id):
        async with self.session_local() as session:
            return session.query(TonWallet).filter_by(wallet_id=wallet_id).first()

    async def delete_wallet(self, wallet_id):
        async with self.session_local() as session:
            wallet = self.get_wallet_by_id(wallet_id)
            session.delete(wallet)
            await session.commit()
