function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function(H) {
        var D = "";
        var E, F, G, B, J, A, I;
        var C = 0;
        H = _utf8_encode(H);
        while (C < H.length) {
            E = H.charCodeAt(C++);
            F = H.charCodeAt(C++);
            G = H.charCodeAt(C++);
            B = E >> 2;
            J = ((E & 3) << 4) | (F >> 4);
            A = ((F & 15) << 2) | (G >> 6);
            I = G & 63;
            if (isNaN(F)) {
                A = I = 64
            } else {
                if (isNaN(G)) {
                    I = 64
                }
            }
            D = D + _keyStr.charAt(B) + _keyStr.charAt(J) + _keyStr.charAt(A) + _keyStr.charAt(I)
        }
        return D
    };
    this.decode = function(H) {
        var D = "";
        var E, F, G;
        var B, J, A, I;
        var C = 0;
        H = H.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (C < H.length) {
            B = _keyStr.indexOf(H.charAt(C++));
            J = _keyStr.indexOf(H.charAt(C++));
            A = _keyStr.indexOf(H.charAt(C++));
            I = _keyStr.indexOf(H.charAt(C++));
            E = (B << 2) | (J >> 4);
            F = ((J & 15) << 4) | (A >> 2);
            G = ((A & 3) << 6) | I;
            D = D + String.fromCharCode(E);
            if (A != 64) {
                D = D + String.fromCharCode(F)
            }
            if (I != 64) {
                D = D + String.fromCharCode(G)
            }
        }
        D = _utf8_decode(D);
        return D
    };
    _utf8_encode = function(C) {
        C = C.replace(/\r\n/g, "\n");
        var B = "";
        for (var A = 0; A < C.length; A++) {
            var D = C.charCodeAt(A);
            if (D < 128) {
                B += String.fromCharCode(D)
            } else {
                if ((D > 127) && (D < 2048)) {
                    B += String.fromCharCode((D >> 6) | 192);
                    B += String.fromCharCode((D & 63) | 128)
                } else {
                    B += String.fromCharCode((D >> 12) | 224);
                    B += String.fromCharCode(((D >> 6) & 63) | 128);
                    B += String.fromCharCode((D & 63) | 128)
                }
            }
        }
        return B
    };
    _utf8_decode = function(B) {
        var C = "";
        var A = 0;
        var D = c1 = c2 = 0;
        while (A < B.length) {
            D = B.charCodeAt(A);
            if (D < 128) {
                C += String.fromCharCode(D);
                A++
            } else {
                if ((D > 191) && (D < 224)) {
                    c2 = B.charCodeAt(A + 1);
                    C += String.fromCharCode(((D & 31) << 6) | (c2 & 63));
                    A += 2
                } else {
                    c2 = B.charCodeAt(A + 1);
                    c3 = B.charCodeAt(A + 2);
                    C += String.fromCharCode(((D & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    A += 3
                }
            }
        }
        return C
    }
};