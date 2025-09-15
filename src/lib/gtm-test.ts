// /**
//  * GTM Testing Utility
//  * 
//  * This file contains utilities to help test GTM events in development.
//  * Use this in browser console to verify events are being tracked.
//  */

// /**
//  * Monitor GTM dataLayer pushes
//  * Run this in browser console to see all GTM events
//  */
// export function monitorGTMEvents() {
//     if (typeof window === "undefined") {
//         console.warn("Not in browser environment");
//         return;
//     }

//     // Initialize dataLayer if it doesn't exist
//     if (!window.dataLayer) {
//         (window as any).dataLayer = [];
//     }

//     // Store original push method
//     const originalPush = window.dataLayer?.push;

//     // Override push to log events
//     window.dataLayer.push = function (...args: any[]) {
//         console.group("🔍 GTM Event Pushed");
//         console.log("Event data:", args[0]);
//         console.groupEnd();

//         // Call original push method
//         return originalPush?.apply(this, args);
//     };

//     console.log("✅ GTM Event monitoring enabled. Add items to cart to see events.");
// }

// /**
//  * Check if dataLayer exists and has events
//  */
// export function checkGTMDataLayer() {
//     if (typeof window === "undefined") {
//         console.warn("Not in browser environment");
//         return;
//     }

//     if (!window.dataLayer) {
//         console.warn("❌ GTM dataLayer not found");
//         return;
//     }

//     console.log("✅ GTM dataLayer found");
//     console.log(`📊 Total events in dataLayer: ${window.dataLayer.length}`);

//     // Log recent add_to_cart events
//     const addToCartEvents = window.dataLayer.filter((event: any) => event.event === "add_to_cart");
//     console.log(`🛒 Add to cart events: ${addToCartEvents.length}`);

//     if (addToCartEvents.length > 0) {
//         console.log("Recent add_to_cart events:", addToCartEvents.slice(-3));
//     }
// }

// /**
//  * Test GTM setup by pushing a test event
//  */
// export function testGTMEvent() {
//     if (typeof window === "undefined") {
//         console.warn("Not in browser environment");
//         return;
//     }

//     if (!window.dataLayer) {
//         console.warn("❌ GTM dataLayer not found");
//         return;
//     }

//     const testEvent = {
//         event: "test_event",
//         test_data: {
//             timestamp: new Date().toISOString(),
//             message: "GTM test event from development"
//         }
//     };

//     window.dataLayer.push(testEvent);
//     console.log("✅ Test event pushed to GTM:", testEvent);
// }

// // Auto-run monitoring in development
// if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
//     // Wait for GTM to load
//     setTimeout(() => {
//         console.log("🚀 GTM Testing utilities loaded");
//         console.log("Available commands:");
//         console.log("- monitorGTMEvents() - Monitor all GTM pushes");
//         console.log("- checkGTMDataLayer() - Check current dataLayer state");
//         console.log("- testGTMEvent() - Push a test event");
//     }, 1000);
// }


