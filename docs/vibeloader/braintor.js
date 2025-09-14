try {
    let e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {}
      , t = (new e.Error).stack;
    t && (e._sentryDebugIds = e._sentryDebugIds || {},
    e._sentryDebugIds[t] = "ad47e78d-88ec-497d-907e-72d2e6e3a84b",
    e._sentryDebugIdIdentifier = "sentry-dbid-ad47e78d-88ec-497d-907e-72d2e6e3a84b")
} catch (e) {}
{
    let e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : {};
    e._sentryModuleMetadata = e._sentryModuleMetadata || {},
    e._sentryModuleMetadata[new e.Error().stack] = Object.assign({}, e._sentryModuleMetadata[new e.Error().stack], {
        "_sentryBundlerPluginAppKey:vibechain-nextjs": !0
    })
}
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[1012, 3250], {
    16205: (e, t, n) => {
        "use strict";
        n.d(t, {
            Ht: () => o
        });
        var a = n(95155);
        n(12115);
        var r = n(87017)
          , i = n(26715);
        let s = new r.E({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: !1,
                    retry: !1,
                    staleTime: 3e4
                }
            }
        })
          , o = e => {
            let {children: t} = e;
            return (0,
            a.jsx)(i.Ht, {
                client: s,
                children: t
            })
        }
    }
    ,
    17024: e => {
        e.exports = {
            style: {
                fontFamily: "'sharpie', 'sharpie Fallback'",
                fontWeight: 900,
                fontStyle: "normal"
            },
            className: "__className_edf147",
            variable: "__variable_edf147"
        }
    }
    ,
    18237: (e, t, n) => {
        "use strict";
        n.d(t, {
            Zf: () => a,
            $W: () => r
        });
        let a = {
            1: "https://etherscan.io",
            10: "https://optimistic.etherscan.io",
            8453: "https://basescan.org"
        }
          , r = {
            NODE_NETWORK: "mainnet",
            DEBUG_MODE: !1,
            ONE_STEP_CONTROLLER_ADDRESS: "0x74b0CaD344f4FF38d5D5B2F6A90CA63b73cB6BaC",
            ONE_STEP_CONTROLLER_ABI: [{
                inputs: [{
                    internalType: "contract BaseRegistrar",
                    name: "_base",
                    type: "address"
                }, {
                    internalType: "contract IPriceOracle",
                    name: "_prices",
                    type: "address"
                }],
                stateMutability: "nonpayable",
                type: "constructor"
            }, {
                anonymous: !1,
                inputs: [{
                    indexed: !1,
                    internalType: "string",
                    name: "name",
                    type: "string"
                }, {
                    indexed: !0,
                    internalType: "bytes32",
                    name: "label",
                    type: "bytes32"
                }, {
                    indexed: !0,
                    internalType: "address",
                    name: "owner",
                    type: "address"
                }, {
                    indexed: !1,
                    internalType: "uint256",
                    name: "duration",
                    type: "uint256"
                }, {
                    indexed: !1,
                    internalType: "uint256",
                    name: "baseCost",
                    type: "uint256"
                }, {
                    indexed: !1,
                    internalType: "uint256",
                    name: "premium",
                    type: "uint256"
                }, {
                    indexed: !1,
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256"
                }],
                name: "NameRegistered",
                type: "event"
            }, {
                anonymous: !1,
                inputs: [{
                    indexed: !1,
                    internalType: "string",
                    name: "name",
                    type: "string"
                }, {
                    indexed: !0,
                    internalType: "bytes32",
                    name: "label",
                    type: "bytes32"
                }, {
                    indexed: !1,
                    internalType: "uint256",
                    name: "cost",
                    type: "uint256"
                }, {
                    indexed: !1,
                    internalType: "uint256",
                    name: "expires",
                    type: "uint256"
                }],
                name: "NameRenewed",
                type: "event"
            }, {
                anonymous: !1,
                inputs: [{
                    indexed: !0,
                    internalType: "address",
                    name: "previousOwner",
                    type: "address"
                }, {
                    indexed: !0,
                    internalType: "address",
                    name: "newOwner",
                    type: "address"
                }],
                name: "OwnershipTransferred",
                type: "event"
            }, {
                inputs: [],
                name: "MIN_REGISTRATION_DURATION",
                outputs: [{
                    internalType: "uint256",
                    name: "",
                    type: "uint256"
                }],
                stateMutability: "view",
                type: "function"
            }, {
                inputs: [{
                    internalType: "string",
                    name: "name",
                    type: "string"
                }],
                name: "available",
                outputs: [{
                    internalType: "bool",
                    name: "",
                    type: "bool"
                }],
                stateMutability: "view",
                type: "function"
            }, {
                inputs: [],
                name: "owner",
                outputs: [{
                    internalType: "address",
                    name: "",
                    type: "address"
                }],
                stateMutability: "view",
                type: "function"
            }, {
                inputs: [],
                name: "prices",
                outputs: [{
                    internalType: "contract IPriceOracle",
                    name: "",
                    type: "address"
                }],
                stateMutability: "view",
                type: "function"
            }, {
                inputs: [{
                    internalType: "string",
                    name: "name",
                    type: "string"
                }, {
                    internalType: "address",
                    name: "owner",
                    type: "address"
                }, {
                    internalType: "uint256",
                    name: "duration",
                    type: "uint256"
                }],
                name: "register",
                outputs: [],
                stateMutability: "payable",
                type: "function"
            }, {
                inputs: [{
                    internalType: "string",
                    name: "name",
                    type: "string"
                }, {
                    internalType: "uint256",
                    name: "duration",
                    type: "uint256"
                }],
                name: "renew",
                outputs: [],
                stateMutability: "payable",
                type: "function"
            }, {
                inputs: [],
                name: "renounceOwnership",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }, {
                inputs: [{
                    internalType: "string",
                    name: "name",
                    type: "string"
                }, {
                    internalType: "uint256",
                    name: "duration",
                    type: "uint256"
                }],
                name: "rentPrice",
                outputs: [{
                    components: [{
                        internalType: "uint256",
                        name: "base",
                        type: "uint256"
                    }, {
                        internalType: "uint256",
                        name: "premium",
                        type: "uint256"
                    }],
                    internalType: "struct IPriceOracle.Price",
                    name: "price",
                    type: "tuple"
                }],
                stateMutability: "view",
                type: "function"
            }, {
                inputs: [{
                    internalType: "address",
                    name: "newOwner",
                    type: "address"
                }],
                name: "transferOwnership",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }, {
                inputs: [{
                    internalType: "string",
                    name: "name",
                    type: "string"
                }],
                name: "valid",
                outputs: [{
                    internalType: "bool",
                    name: "",
                    type: "bool"
                }],
                stateMutability: "pure",
                type: "function"
            }, {
                inputs: [],
                name: "withdraw",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }],
            CHAIN_ID: 8453,
            IS_PROD: !0,
            IS_PROPD: !0,
            API_KEY: "vibechain-default-5477272",
            BASE_URL: "https://vibechain.com",
            AUTH_KEY: "vibechain-auth-token",
            SERVER_URL: "https://build.wield.xyz",
            WALLET_IFRAME_ORIGIN: "https://wallet.vibechain.com",
            WALLET_IFRAME_URL: "https://wallet.vibechain.com/labs/iframe",
            VIBEJOKER_UNBOXING_ENABLED: !1,
            ALCHEMY_SDK_API_KEY: "Cjy_JY53Aun4i16sUBwbhrzkXpALqRFi",
            CB_PROJECT_ID: "b334f30f-b5c9-433f-ace3-d83977dced36",
            CB_API_KEY: "jjOpfQBuh0gHqIZMRdddjQpNEgltdspq"
        }
    }
    ,
    18492: () => {}
    ,
    23250: (e, t, n) => {
        "use strict";
        n.d(t, {
            get: () => s,
            post: () => o,
            v$: () => i,
            yJ: () => l
        });
        var a = n(18237);
        let r = e => "".concat(a.$W.SERVER_URL).concat(e);
        async function i(e) {
            let t, n, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, s = e.startsWith("http") ? e : r(e), o = localStorage.getItem("vibeAuthToken"), l = new Headers(i.headers || {});
            o && l.set("Authorization", "Bearer ".concat(o)),
            l.set("API-KEY", a.$W.API_KEY),
            l.set("X-Bypass-Image-Proxy", "true"),
            i.body && !l.has("Content-Type") && l.set("Content-Type", "application/json");
            let u = {
                ...i,
                headers: l
            };
            try {
                t = await fetch(s, u)
            } catch (e) {
                return console.error("Network error:", e),
                {
                    success: !1,
                    status: 0,
                    data: {
                        error: "Network error",
                        message: "Unable to connect to server. Please check your connection.",
                        isNetworkError: !0
                    },
                    response: null,
                    isNetworkError: !0
                }
            }
            if (!t)
                return {
                    success: !1,
                    status: 0,
                    data: {
                        error: "No response",
                        message: "No response from server"
                    },
                    response: null,
                    isNetworkError: !0
                };
            t.status;
            try {
                n = await t.json()
            } catch (e) {
                return {
                    success: !1,
                    status: t.status,
                    data: {
                        error: "Invalid response",
                        message: "Server returned an invalid response"
                    },
                    response: t
                }
            }
            return {
                success: t.ok,
                status: t.status,
                data: n,
                response: t
            }
        }
        function s(e) {
            let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return i(e, {
                ...t,
                method: "GET"
            })
        }
        function o(e, t) {
            let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
            return i(e, {
                ...n,
                method: "POST",
                body: JSON.stringify(t)
            })
        }
        function l(e, t) {
            let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
            return i(e, {
                ...n,
                method: "PUT",
                body: JSON.stringify(t)
            })
        }
    }
    ,
    28746: () => {}
    ,
    41796: e => {
        e.exports = {
            style: {
                fontFamily: "'clashDisplay', 'clashDisplay Fallback'",
                fontWeight: 600,
                fontStyle: "normal"
            },
            className: "__className_e1ba53",
            variable: "__variable_e1ba53"
        }
    }
    ,
    44577: (e, t, n) => {
        "use strict";
        n.d(t, {
            T: () => l,
            m: () => o
        });
        var a = n(95155)
          , r = n(12115)
          , i = n(23250);
        let s = (0,
        r.createContext)(null);
        function o(e) {
            let {children: t} = e
              , [n,o] = (0,
            r.useState)(null)
              , [l,u] = (0,
            r.useState)(!0)
              , [c,d] = (0,
            r.useState)(null)
              , [p,y] = (0,
            r.useState)(!1);
            (0,
            r.useEffect)( () => {
                localStorage.getItem("vibeAuthToken") ? m() : u(!1)
            }
            , []);
            let m = async () => {
                try {
                    u(!0);
                    let e = await (0,
                    i.get)("/vibe/auth/me");
                    if (e.isNetworkError)
                        return void console.log("Network error while fetching profile in context, keeping current state");
                    if (!e.success) {
                        localStorage.removeItem("vibeAuthToken"),
                        o(null);
                        return
                    }
                    o(e.data.user)
                } catch (n) {
                    var e, t;
                    console.error("Error fetching user profile:", n),
                    (null == (e = n.message) ? void 0 : e.includes("network")) || (null == (t = n.message) ? void 0 : t.includes("fetch")) || d("Failed to load user profile")
                } finally {
                    u(!1)
                }
            }
            ;
            return (0,
            a.jsx)(s.Provider, {
                value: {
                    user: n,
                    setUser: o,
                    loading: l,
                    setLoading: u,
                    error: c,
                    setError: d,
                    isSignInOverlayOpen: p,
                    setIsSignInOverlayOpen: y
                },
                children: t
            })
        }
        function l() {
            let e = (0,
            r.useContext)(s);
            if (null === e)
                throw Error("useVibeAuthContext must be used within a VibeAuthProvider");
            return e
        }
    }
    ,
    47772: (e, t, n) => {
        "use strict";
        n.d(t, {
            default: () => s
        });
        var a = n(12115)
          , r = n(53074)
          , i = n(62105);
        function s() {
            (0,
            a.useEffect)( () => {
                (async () => {
                    try {
                        await r.xh.actions.ready(),
                        await r.xh.isInMiniApp() && (window.__IS_FARCASTER_MINI_APP = !0,
                        await r.xh.actions.addMiniApp())
                    } catch (e) {
                        console.error("Error making miniapp ready:", e),
                        i.Cp(e)
                    }
                }
                )()
            }
            , [])
        }
    }
    ,
    47790: () => {}
    ,
    52596: (e, t, n) => {
        "use strict";
        function a() {
            for (var e, t, n = 0, a = "", r = arguments.length; n < r; n++)
                (e = arguments[n]) && (t = function e(t) {
                    var n, a, r = "";
                    if ("string" == typeof t || "number" == typeof t)
                        r += t;
                    else if ("object" == typeof t)
                        if (Array.isArray(t)) {
                            var i = t.length;
                            for (n = 0; n < i; n++)
                                t[n] && (a = e(t[n])) && (r && (r += " "),
                                r += a)
                        } else
                            for (a in t)
                                t[a] && (r && (r += " "),
                                r += a);
                    return r
                }(e)) && (a && (a += " "),
                a += t);
            return a
        }
        n.d(t, {
            $: () => a,
            A: () => r
        });
        let r = a
    }
    ,
    58275: (e, t, n) => {
        "use strict";
        n.d(t, {
            ej: () => d,
            u2: () => c
        });
        var a = n(95155)
          , r = n(12115)
          , i = n(2145)
          , s = n(22930)
          , o = n(26719)
          , l = n(88596);
        let u = r.createContext({
            loading: !1,
            error: null,
            onSignMessage: async () => {}
            ,
            provider: null,
            currentAddress: null,
            onDisconnect: () => {}
        })
          , c = () => r.useContext(u)
          , d = e => {
            let {children: t} = e
              , [n,c] = r.useState(!1)
              , [d,p] = r.useState(null)
              , {address: y, isConnecting: m, isReconnecting: h} = (0,
            i.F)()
              , {signMessageAsync: f} = (0,
            s.Y)()
              , {disconnect: g} = (0,
            o.u)()
              , b = r.useMemo( () => m || h || n, [m, h, n])
              , E = async e => {
                try {
                    c(!0);
                    let t = await f({
                        message: e
                    });
                    return (0,
                    l.n)("Signed Message"),
                    c(!1),
                    t
                } catch (e) {
                    return c(!1),
                    p(e.message),
                    null
                }
            }
            ;
            return r.useEffect( () => {
                y && (0,
                l.b)(y, "Connected Wallet")
            }
            , [y]),
            r.useEffect( () => {
                b && (0,
                l.n)("Connect Wallet Initiated")
            }
            , [b]),
            (0,
            a.jsx)(u.Provider, {
                value: {
                    loading: b,
                    currentAddress: y,
                    onSignMessage: E,
                    error: d || null,
                    onDisconnect: g
                },
                children: t
            })
        }
    }
    ,
    61276: () => {}
    ,
    65936: (e, t, n) => {
        "use strict";
        n.d(t, {
            J: () => o,
            b: () => s
        });
        var a = n(95155)
          , r = n(12115);
        let i = (0,
        r.createContext)()
          , s = e => {
            let {children: t} = e
              , [n,s] = (0,
            r.useState)(!1)
              , [o,l] = (0,
            r.useState)(!1)
              , [u,c] = (0,
            r.useState)({
                initialContractAddress: null,
                isGraduated: !1,
                onExchangeComplete: null
            })
              , [d,p] = (0,
            r.useState)(!1)
              , [y,m] = (0,
            r.useState)({})
              , h = Object.values(y).some(e => !0 === e)
              , f = Object.values(y).filter(e => !0 === e).length;
            return (0,
            a.jsx)(i.Provider, {
                value: {
                    isOpen: n,
                    isMinimized: o,
                    exchangeConfig: u,
                    openExchange: function() {
                        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        c(e),
                        s(!0),
                        l(!1)
                    },
                    closeExchange: () => {
                        s(!1),
                        l(!1)
                    }
                    ,
                    toggleMinimize: () => {
                        l(!o)
                    }
                    ,
                    setExchangeConfig: c,
                    isLoading: d,
                    setIsLoading: p,
                    loadingStates: y,
                    setLoadingState: (e, t) => {
                        m(n => ({
                            ...n,
                            [e]: t
                        }))
                    }
                    ,
                    clearLoadingState: e => {
                        m(t => {
                            let n = {
                                ...t
                            };
                            return delete n[e],
                            n
                        }
                        )
                    }
                    ,
                    clearAllLoadingStates: () => {
                        m({})
                    }
                    ,
                    isAnyLoading: h,
                    activeLoadingCount: f,
                    isKeyLoading: e => !0 === y[e],
                    getActiveLoadingKeys: () => Object.keys(y).filter(e => !0 === y[e]),
                    setMultipleLoadingStates: e => {
                        m(t => ({
                            ...t,
                            ...e
                        }))
                    }
                },
                children: t
            })
        }
          , o = () => {
            let e = (0,
            r.useContext)(i);
            if (!e)
                throw Error("useGlobalLayout must be used within GlobalLayoutProvider");
            return e
        }
    }
    ,
    71922: (e, t, n) => {
        "use strict";
        n.d(t, {
            $: () => T,
            F: () => A
        });
        var a = n(36241)
          , r = n(37200)
          , i = n(53658)
          , s = n(96709)
          , o = n(63439)
          , l = n(18237)
          , u = n(23953)
          , c = n(40943)
          , d = n(5921)
          , p = n(408)
          , y = n(71685)
          , m = n(71434)
          , h = n(7764)
          , f = n(41654);
        let g = [r.r, i.R, s.E]
          , b = "970364a260dd0973593df0be35ab12bb"
          , E = "vibechain"
          , v = {
            [r.r.id]: (0,
            a.L)("https://eth-mainnet.g.alchemy.com/v2/AQaZ6SE-i5c7QlsF6gTghJvvHK7Eueav"),
            [i.R.id]: (0,
            a.L)("https://opt-mainnet.g.alchemy.com/v2/kGjf54VV7DLvs1XD7MAnlM3hFPZzhQq-"),
            [s.E.id]: (0,
            a.L)("https://base-mainnet.g.alchemy.com/v2/iyCTEfxPWrxTy3ZS9CgyQ37C4IUUZdCH")
        }
          , _ = (0,
        o.Qq)([{
            groupName: "Recommended",
            wallets: [p.d, y.D, m.m, h.Z, f.G]
        }], {
            appName: E,
            projectId: b,
            walletConnectParameters: {
                projectId: b,
                qrModalOptions: {
                    themeVariables: {
                        "--wcm-z-index": "9999999"
                    }
                }
            }
        })
          , T = (0,
        u.Z)({
            appName: E,
            projectId: b,
            chains: g,
            transports: v,
            connectors: _
        })
          , w = (0,
        d.y)({
            cdpConfig: {
                projectId: l.$W.CB_PROJECT_ID,
                apiKey: l.$W.CB_API_KEY
            },
            providerConfig: {
                chains: [s.E],
                transports: {
                    [s.E.id]: (0,
                    a.L)("https://base-mainnet.g.alchemy.com/v2/iyCTEfxPWrxTy3ZS9CgyQ37C4IUUZdCH")
                },
                announceProvider: !0
            }
        })
          , A = (0,
        u.Z)({
            appName: E,
            projectId: b,
            chains: [s.E],
            transports: {
                [s.E.id]: (0,
                a.L)("https://base-mainnet.g.alchemy.com/v2/iyCTEfxPWrxTy3ZS9CgyQ37C4IUUZdCH")
            },
            connectors: [..._, (0,
            c.G4)(), w]
        })
    }
    ,
    77800: (e, t, n) => {
        Promise.resolve().then(n.bind(n, 47772)),
        Promise.resolve().then(n.bind(n, 79898)),
        Promise.resolve().then(n.bind(n, 88596)),
        Promise.resolve().then(n.t.bind(n, 41796, 23)),
        Promise.resolve().then(n.t.bind(n, 88333, 23)),
        Promise.resolve().then(n.t.bind(n, 17024, 23)),
        Promise.resolve().then(n.t.bind(n, 28746, 23)),
        Promise.resolve().then(n.t.bind(n, 18492, 23))
    }
    ,
    79898: (e, t, n) => {
        "use strict";
        n.d(t, {
            default: () => b
        });
        var a = n(95155);
        n(12115);
        var r = n(83415)
          , i = n(80278)
          , s = n(58275)
          , o = n(16205)
          , l = n(71922)
          , u = n(28028)
          , c = n(65936)
          , d = n(86016)
          , p = n(44577)
          , y = n(65704)
          , m = n(89965)
          , h = n(18237);
        let f = {
            projectId: h.$W.CB_PROJECT_ID,
            apiKey: h.$W.CB_API_KEY
        }
          , g = {
            name: "vibe.market",
            logoUrl: "https://vibechain.com/vibemarket/assets/logo/1-background.png"
        }
          , b = e => {
            let {children: t} = e;
            return (0,
            a.jsx)(o.Ht, {
                children: (0,
                a.jsx)(r.x, {
                    config: l.F,
                    children: (0,
                    a.jsx)(m.b8, {
                        config: f,
                        children: (0,
                        a.jsx)(y.KQ, {
                            config: f,
                            app: g,
                            children: (0,
                            a.jsx)(i.q, {
                                initialChain: u.RT.CHAIN_ID,
                                children: (0,
                                a.jsx)(s.ej, {
                                    children: (0,
                                    a.jsx)(p.m, {
                                        children: (0,
                                        a.jsx)(d.A, {
                                            children: (0,
                                            a.jsx)(c.b, {
                                                children: t
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }
    }
    ,
    80278: (e, t, n) => {
        "use strict";
        n.d(t, {
            q: () => s
        });
        var a = n(95155);
        n(12115);
        var r = n(63439);
        n(85035);
        var i = n(96709);
        let s = e => {
            let {children: t, initialChain: n} = e;
            return (0,
            a.jsx)(r.qL, {
                initialChain: n || i.E.id,
                modalSize: "compact",
                children: t
            })
        }
    }
    ,
    86016: (e, t, n) => {
        "use strict";
        n.d(t, {
            A: () => c,
            u: () => d
        });
        var a = n(95155)
          , r = n(12115)
          , i = n(28028);
        let s = "vibechain_user_config"
          , o = (0,
        r.createContext)(null)
          , l = () => {
            try {
                let e = localStorage.getItem(s);
                return e ? JSON.parse(e) : null
            } catch (e) {
                return console.error("Error reading config from localStorage:", e),
                null
            }
        }
          , u = e => {
            try {
                localStorage.setItem(s, JSON.stringify(e))
            } catch (e) {
                console.error("Error saving config to localStorage:", e)
            }
        }
        ;
        function c(e) {
            var t, n;
            let {children: s} = e
              , c = !i.RT.IS_PROD
              , [d,p] = (0,
            r.useState)({
                THEME_MODE: "light",
                SHOW_QUEST: !0,
                SHOW_BOUNTY: !1,
                NSFW_FEATURE: !0,
                CHART_FEATURE: !0
            });
            (0,
            r.useEffect)( () => {
                let e = l();
                e && p(t => ({
                    ...t,
                    THEME_MODE: e.THEME_MODE || t.THEME_MODE
                })),
                y((null == e ? void 0 : e.THEME_MODE) || d.THEME_MODE)
            }
            , []);
            let y = e => {
                "dark" === e ? (document.documentElement.classList.add("dark"),
                document.documentElement.classList.remove("light")) : (document.documentElement.classList.add("light"),
                document.documentElement.classList.remove("dark"))
            }
              , m = function(e, t) {
                let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
                  , a = {
                    ...d,
                    [e]: t
                };
                p(a),
                n.skipStorage || u(a)
            }
              , h = {
                THEME_MODE: d.THEME_MODE || "dark",
                SHOW_QUEST: !0,
                SHOW_BOUNTY: null != (t = d.SHOW_BOUNTY) ? t : c,
                NSFW_FEATURE: !0,
                CHART_FEATURE: null != (n = d.CHART_FEATURE) ? n : c,
                setConfigValue: m,
                getConfigValue: e => d[e],
                toggleTheme: () => {
                    let e = "dark" === (d.THEME_MODE || "dark") ? "light" : "dark";
                    m("THEME_MODE", e),
                    y(e)
                }
            };
            return (0,
            a.jsx)(o.Provider, {
                value: h,
                children: s
            })
        }
        function d() {
            let e = (0,
            r.useContext)(o);
            if (null === e)
                throw Error("useGlobalUserConfig must be used within a GlobalUserConfigProvider");
            return e
        }
    }
    ,
    88333: e => {
        e.exports = {
            style: {
                fontFamily: "'satoshi', 'satoshi Fallback'",
                fontWeight: 400,
                fontStyle: "normal"
            },
            className: "__className_79f085",
            variable: "__variable_79f085"
        }
    }
    ,
    88596: (e, t, n) => {
        "use strict";
        n.d(t, {
            AnalyticsClientInit: () => y,
            b: () => d,
            n: () => p
        });
        var a = n(12115)
          , r = n(96411)
          , i = n(72341);
        let s = "5b9f4ecc4ac8201a3287587d65df2091"
          , o = "phc_E4ILu05yboU6btPUIU25rTAdOAlKKXemI3gJR0DSvWw"
          , l = "https://d3u4yv2xfg8jv0.cloudfront.net"
          , u = "https://us.i.posthog.com"
          , c = {}
          , d = async function(e, t) {
            let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
            try {
                r.Ts(s, {
                    defaultTracking: !0
                }),
                r.do(e),
                r.$s(t)
            } catch (e) {
                console.error("Amplitude event failed to log: ".concat(e))
            }
            try {
                i.Ay.init(o, {
                    api_host: l,
                    ui_host: u,
                    person_profiles: "identified_only",
                    autocapture: !1
                }),
                i.Ay._isIdentified() || i.Ay.identify(e),
                c[t] || (i.Ay.capture(t, {
                    ...n
                }),
                c[t] = !0)
            } catch (e) {
                console.error("Posthog event failed to log: ".concat(e))
            }
        }
          , p = async function(e) {
            let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            try {
                r.Ts(s, {
                    defaultTracking: !0
                }),
                r.$s(e)
            } catch (e) {
                console.error("Amplitude event failed to log: ".concat(e))
            }
            try {
                i.Ay.init(o, {
                    api_host: l,
                    ui_host: u,
                    person_profiles: "identified_only",
                    autocapture: !1
                }),
                c[e] || (i.Ay.capture(e, {
                    ...t
                }),
                c[e] = !0)
            } catch (e) {
                console.error("Posthog event failed to log: ".concat(e))
            }
        }
          , y = function() {
            let {title: e, ...t} = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            return a.useEffect( () => {
                try {
                    let e = new URLSearchParams(window.location.search).get("invite");
                    e && localStorage.setItem("referralCode", e)
                } catch (e) {
                    console.error("Referral code failed to set: ".concat(e))
                }
                p(e, t)
            }
            , [t]),
            null
        }
    }
}, e => {
    var t = t => e(e.s = t);
    e.O(0, [4106, 6922, 3305, 5867, 661, 8956, 8451, 8229, 4134, 2514, 9334, 5364, 9221, 6411, 5226, 1504, 8028, 8441, 5594, 7358], () => t(77800)),
    _N_E = e.O()
}
]);
