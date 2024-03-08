"use client";
import { useEffect } from "react";
import {
  initialize,
  openSession,
  automaticallyShowInAppMessages,
  requestPushPermission,
  getUser,
  logCustomEvent,
  requestImmediateDataFlush,
  changeUser,
  isPushSupported,
} from "@braze/web-sdk";
// import * as braze from "@braze/web-sdk";
// const {
//   initialize,
//   openSession,
//   automaticallyShowInAppMessages,
//   requestPushPermission,
//   getUser,
//   logCustomEvent,
//   changeUser,
//   requestImmediateDataFlush,
//   isPushSupported,
// } = braze;

const Braze = () => {
  useEffect(() => {
    initialize("0f75aa40-2b51-4cea-a382-c20fa456cb0f", {
      baseUrl: "sdk.iad-03.braze.com",
      enableLogging: true,
    });
    // getUser()?.setCustomUserAttribute("Patryk", new Date());
    automaticallyShowInAppMessages();
    // isPushSupported();
    openSession();
    requestPushPermission(() => {
      logCustomEvent("Custom");
      requestImmediateDataFlush();
    });
  }, []);

  return <button>click me</button>;
};

export default Braze;
