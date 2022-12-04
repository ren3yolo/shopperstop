import React from "react";

const steps: Array<String> = [
  "User Login",
  "Shipping Address",
  "Payment Method",
  "Place Order",
];

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <div className='mb-5 flex flex-wrap'>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex-1 border-b-2 text-center ${
            index <= activeStep
              ? "border-indigo-500 text-indigo-500"
              : "border-gray-400 text-gray-400"
          } `}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
