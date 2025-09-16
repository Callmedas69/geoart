## Error Type
Console Error - RESOLVED ✅

## Error Message
Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.


    at Object.throwInvalidHookError (webpack-internal:///71272:6728:13)
    at exports.useContext (webpack-internal:///97886:1204:25)
    at useConfig (webpack-internal:///12318:17:175)
    at useReadContract (webpack-internal:///8786:21:76)
    at useBuyToken.useCallback[getMintPrice] (webpack-internal:///3508:41:179)
    at BuyModal.useEffect.calculateCost (webpack-internal:///5847:40:44)

Next.js version: 15.5.0 (Webpack)



D:\Harry\BasedNouns\…console-error.js:62 Error getting mint price: Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.
    at useConfig (D:\Harry\src\hooks\useConfig.ts:20:49)
    at useReadContract (D:\Harry\src\hooks\u…adContract.ts:82:15)
    at useBuyToken.useCallback[getMintPrice] (D:\Harry\BasedNouns\…seBuyToken.ts:30:45)
    at BuyModal.useEffect.calculateCost (D:\Harry\BasedNouns\…\BuyModal.tsx:46:28)

D:\Harry\BasedNouns\…console-error.js:62 Error calculating mint cost: Error: Failed to get mint price
    at useBuyToken.useCallback[getMintPrice] (D:\Harry\BasedNouns\…seBuyToken.ts:39:13)
    at BuyModal.useEffect.calculateCost (D:\Harry\BasedNouns\…\BuyModal.tsx:46:28)
error	@	D:\Harry\BasedNouns\…console-error.js:62
D:\Harry\BasedNouns\…console-error.js:62 Error getting mint price: Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.
    at useConfig (D:\Harry\src\hooks\useConfig.ts:20:49)
    at useReadContract (D:\Harry\src\hooks\u…adContract.ts:82:15)
    at useBuyToken.useCallback[getMintPrice] (D:\Harry\BasedNouns\…seBuyToken.ts:30:45)
    at BuyModal.useEffect.calculateCost (D:\Harry\BasedNouns\…\BuyModal.tsx:46:28)
D:\Harry\BasedNouns\…console-error.js:62 Error calculating mint cost: Error: Failed to get mint price
    at useBuyToken.useCallback[getMintPrice] (D:\Harry\BasedNouns\…seBuyToken.ts:39:13)
    at BuyModal.useEffect.calculateCost (D:\Harry\BasedNouns\…\BuyModal.tsx:46:28)

---

## SOLUTION APPLIED ✅

**Root Cause:** useReadContract hook was being called inside a callback function, violating the Rules of Hooks.

**Fix:** Changed from useReadContract hook to readContract action in useBuyToken.ts

**Additional Fixes:**
1. Updated variable names: packAmount → firstBuyPackAmount  
2. Corrected ABI: IBoosterTokenV2ABI → IBoosterDropV2ABI
3. Updated function: buy() → mint() for pack minting
4. Fixed dependency arrays in useCallback hooks

**Result:** TypeScript compilation passes, hook rules compliance restored, pack minting functionality working.
