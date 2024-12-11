import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function LoaderDialog(props) {
  return (
    <Transition appear show={props.show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 overflow-y-auto"
        onClose={props.openLoaderModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the PriceModal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#24274D] dark:bg-white shadow-xl">
              <Dialog.Title
                as="h3"
                className="text-white text-2xl font-semibold leading-6 "
              ></Dialog.Title>

              <div className="flex flex-col items-center space-y-4">
                <div className="text-white dark:text-gray-800 text-3xl font-semibold">
                  Loading
                </div>
                <div className="text-[#6C71AD] dark:text-gray-600 text-sm">
                  Appreciate Your Waiting
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
