import { Tabs, Tab } from "@nextui-org/react";
import LimitOrders from "../components/LimitOrders/LimitOrders";
import Portfolio from "../components/Portfolio/Portfolio";
import Footer from "../shared/components/Footer"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow w-full max-w-lg mx-auto p-4">
        <Tabs aria-label="Options" variant="light" radius="full" color="primary" className="flex justify-center items-center">
          <Tab key="Portfolio" title="Portfolio">
            <Portfolio />
          </Tab>
          <Tab key="LimitOrders" title="Swap">
            <LimitOrders />
          </Tab>
          <Tab key="WalkOfFame" isDisabled title="Walk of Fame" />
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
