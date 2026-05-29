  /*
    Symmetric keys: conceptually a master key is shared amongst an affinity group of people.
    That master key is always encrypted with a user's password-derived key when at rest. 
  
    1. Create a random 256 bit master key. 
        const k = await key(); 
        const j = await window.crypto.subtle.exportKey('jwk', k);
        console.log(JSON.stringify(j));
        {"alg":"A256GCM","ext":true,"k":"SI8t3XjzV8w7mTgjF1nq3KO8muyd4i1VoAwIoDxd81E","key_ops":["encrypt","decrypt"],"kty":"oct"}
        
    2. Encrypt test phrase, store encrypted message + iv 
        const e = await encrypt('test string', k, '');
        console.log(e);
        AsKyw4/DjUnCocKWwp3DlhvDgMKS-LXdHwqEZTMKJwrAnwrrCmlvDtHMCFgPDs8Kmwq8bw4klOT/CkBQ=
        (iv is prepended, '-' used as joiner)

    3. Create a password-derived key, store key + salt. (salt1)
        const [s, k] = await passKey('Kropotkin'); 
        const j = await window.crypto.subtle.exportKey('jwk', k); 
        RMOjwp7DvkYfMsOaTRpFw5skw5HCsMOd
        {"alg":"A256GCM","ext":true,"k":"2tG-RZ9Ye68tGRDaP8tF_VeBRVWUaHYLbxvbK3J-yWg","key_ops":["encrypt","decrypt"],"kty":"oct"}
    
    4. Create hash of password, store hash + salt. (salt2)
        const [s2, h] = await ndhash('Kropotkin', 32);
        console.log(wrap(s2));
        console.log(wrap(h));
        YlbDqsKpQcKICsOUwrfCth4gHyBqw6I=
        AVDDpTDDnMKnDyrCqMOGRS9SXDbDpcOTGCx1woUEKcKXwoQ9XVDCmmoUZg==
    
    5. Use password-derived key & password hash for authentication to encrypt master key, 
        store encrypted master key + iv
        const jStr = '{"alg":"A256GCM","ext":true,"k":"2tG-RZ9Ye68tGRDaP8tF_VeBRVWUaHYLbxvbK3J-yWg","key_ops":["encrypt","decrypt"],"kty":"oct"}';
        const j    = JSON.parse(jStr);
        const k    = await window.crypto.subtle.importKey("jwk", j, "AES-GCM", false, ["encrypt","decrypt"]);        
        const ek   = await encrypt(
                      '{"alg":"A256GCM","ext":true,"k":"SI8t3XjzV8w7mTgjF1nq3KO8muyd4i1VoAwIoDxd81E","key_ops":["encrypt","decrypt"],"kty":"oct"}',
                      k,
                      'AVDDpTDDnMKnDyrCqMOGRS9SXDbDpcOTGCx1woUEKcKXwoQ9XVDCmmoUZg=='
                    );                    
        console.log(ek);        
        w6rCp23CnG3DlCIkY8KmC2o=-E39uUMK5wotYwqE7D8KTe8K0alBtwroAwqHDiX8ywpPCuxgSw58ow6TDq8KCbHZSwrdyw5puwokYwpjClggnw6vCry3CvMKXwrbCpMOrwqhTGMK0wqfCrEtBVgjDggXDjUDCn2JpFQVOw57DqCQhNcOiw4PChHhvw4YuwpzDv0JCw7J/woNwDgvDt1DCikIFw4XCsSxNwpNQw5fDvnjDuWUMf8Oyw5XDgzvCk8Kwwrpqw4vCpnTCmQfCgcOIA2LCuBjCmQMUC13Ct2E=
    
    6. Recover password-derived key from password + salt1
        const [s, pk] = await passKey('Kropotkin', 'RMOjwp7DvkYfMsOaTRpFw5skw5HCsMOd');        
        console.log(s);
        console.log(pk);
        const j = await window.crypto.subtle.exportKey('jwk', pk);
        console.log(JSON.stringify(j));
        RMOjwp7DvkYfMsOaTRpFw5skw5HCsMOd
        CryptoKey {type: 'secret', extractable: true, algorithm: {…}, usages: Array(2)}
        {"alg":"A256GCM","ext":true,"k":"2tG-RZ9Ye68tGRDaP8tF_VeBRVWUaHYLbxvbK3J-yWg","key_ops":["encrypt","decrypt"],"kty":"oct"}    
    
    7. Recover master key from encrypted masterkey + iv, user key + salt2
        const [s, pk]  = await passKey('Kropotkin', 'RMOjwp7DvkYfMsOaTRpFw5skw5HCsMOd');       
        const ek       = 'w6rCp23CnG3DlCIkY8KmC2o=-E39uUMK5wotYwqE7D8KTe8K0alBtwroAwqHDiX8ywpPCuxgSw58ow6TDq8KCbHZSwrdyw5puwokYwpjClggnw6vCry3CvMKXwrbCpMOrwqhTGMK0wqfCrEtBVgjDggXDjUDCn2JpFQVOw57DqCQhNcOiw4PChHhvw4YuwpzDv0JCw7J/woNwDgvDt1DCikIFw4XCsSxNwpNQw5fDvnjDuWUMf8Oyw5XDgzvCk8Kwwrpqw4vCpnTCmQfCgcOIA2LCuBjCmQMUC13Ct2E=';    
        const h        = 'AVDDpTDDnMKnDyrCqMOGRS9SXDbDpcOTGCx1woUEKcKXwoQ9XVDCmmoUZg==';    
        const m        = await decrypt(ek, pk, h);        
        console.log(m);
        {alg: 'A256GCM', ext: true, k: 'SI8t3XjzV8w7mTgjF1nq3KO8muyd4i1VoAwIoDxd81E', key_ops: Array(2), kty: 'oct'}
    
    8. Decrypt phrase using master password, display for confirmation
        const [s, pk]  = await passKey('Kropotkin', 'RMOjwp7DvkYfMsOaTRpFw5skw5HCsMOd');       
        const ek       = 'w6rCp23CnG3DlCIkY8KmC2o=-E39uUMK5wotYwqE7D8KTe8K0alBtwroAwqHDiX8ywpPCuxgSw58ow6TDq8KCbHZSwrdyw5puwokYwpjClggnw6vCry3CvMKXwrbCpMOrwqhTGMK0wqfCrEtBVgjDggXDjUDCn2JpFQVOw57DqCQhNcOiw4PChHhvw4YuwpzDv0JCw7J/woNwDgvDt1DCikIFw4XCsSxNwpNQw5fDvnjDuWUMf8Oyw5XDgzvCk8Kwwrpqw4vCpnTCmQfCgcOIA2LCuBjCmQMUC13Ct2E=';    
        const h        = 'AVDDpTDDnMKnDyrCqMOGRS9SXDbDpcOTGCx1woUEKcKXwoQ9XVDCmmoUZg==';    
        const m        = await decrypt(ek, pk, h);            
        const mk       = await window.crypto.subtle.importKey("jwk", m, "AES-GCM", false, ["encrypt","decrypt"]);         
        const plain    = await decrypt(
                          'AsKyw4/DjUnCocKWwp3DlhvDgMKS-LXdHwqEZTMKJwrAnwrrCmlvDtHMCFgPDs8Kmwq8bw4klOT/CkBQ=', 
                          mk,
                          ''
                        );                        
        console.log(plain);
        test string
        
    ----------------------------
    
    Asymmetric keys: conceptually, allow unverified users to submit data using the public key. 
    Verified users can each have a copy of the private key encrypted with their password-derived key. 
    (using pass hash as auth)
    
    A. Create asymmetric key pair. 
        const kp = await makeKeyPair();
        console.log(kp);
        console.log(kp.privateKey);
        console.log(kp.publicKey);
    
    B. Create exported, storable forms of the keys
        const pri = await window.crypto.subtle.exportKey('jwk', kp.privateKey);
        console.log(JSON.stringify(pri));
        
        const pub = await window.crypto.subtle.exportKey('jwk', kp.publicKey);
        console.log(JSON.stringify(pub));
    
        {"alg":"RSA-OAEP-512","d":"Kp6FjVJ53uUqEWO8q3zDYvMnvx4mknRdLxC0Q9kebTKLbmbez4ZSsvkECtJ3iDTPgLloeHxx3XxtgMsyvulh8PeyHp6EJA5OyiD19SOndkP2N7wf3Z9VxTu2CcG9VyLDPAr3AdXCxyAzfIofTwyA1JWuD4XjoE3mcSTiuR5ruotrWQs8-Nit9JqmVH1p-Y_3NtCVd-M323Dyd-HfxLkXdCfUmG2rg8-ibcKKJDKjDfwZ_G0ds8AWnw2B2TGBOoPdHYDFp3UQ4tbSY9fsAi7LRi2yV5ZHj4DP-uTNLNIuheuVKtcaandIs-4-kVF1yaLHTSsT-pcJSJ6dmU6N5axyQ6za8XvN5DJGwSUHfLGcDYx0kdmXsPWUWg8aQgQ55dqAe5YHvJkpanPiOyclmwIqVn5B9bQ5TPVZbJTyS6RJp6WMS1b5-akL-0Ko5hmXo4IAi_7rXng2quMu84VvbvQxUIBp_hi_84WYk8f-iXzZrexR36oZGZjXCrABo_QzrQNs0i8uwiB3IQsh2xIG4-QQs5K7fW83Gwh0S5v8ja-y0mGSBJmeXGMtoTIMIVFrygf0Mrgt1FDWbjbX-bIoua1TnCKXA1ZTpTLpojlQMwZpy5IxhAuUqFRiaLV_f1g6kJBirycVFLFck-KG4YogF9GQKRrkof8W9Lah7ex9w3fQ5_k","dp":"1UM8wiRKc-hGczrZEoyZATkNS75YiLhOsh6tKYI6ZH49tf_SEGEWs0ZJRZ0c2Ikru9CL9CewJTel5E1GJNgQ7BrBF5IV0DXRVZgAR9_yoUFxQMb-IOGXD4i3c8tA-AfkUz5gZPK8V81frq_Xygi3dGOls6x-g-itpQeOU-wIteHlLmgRvpBOCgxfwKux_UGg_8PwBGzxM03g7QJ4NB6iqC-0LF-hqqJ3mEPzZyT1QqqLmzmhbZ_O0TmR-TwaG_O5wNdXF2HinLYHjBm13ik_zK16HLMSxJ-WOR_ZIj4xwMRF1RXSseuGcsbeMAIIeu8EQu9JfYrC6b6KCWCpkgnZTQ","dq":"fWTR9qBpzelwmJPhepQzLrndobSrigyT3rbXYzpleEteaEgTTNJtjtWeiQ2pVP_UXHt4eUZ3lNXqSynzQQHZ5UWt1t4IYUgwk9nGyeZaS8HZZFim3Ehjh_pCzXYJuG3K-PW3IAnzGpb5yP9XFDQLo69v2bnby01VYRoVFdH-fDVl8K0UDOc4DiQckuif6N_BJLfTEk_KmJ5D82tK1x6sMuy5ziDJ8LoixYyVHhDxZPxG0uksxvwec9KknyUu4Cs00725eWklZ8yQvlmI7l7GHTm_DdtCMSA2Hv1dRQoJB7FsRInI4gAT0QqvthG-lqij6HC8zmIciXTZRVRZXsZAzQ","e":"AQAB","ext":true,"key_ops":["decrypt"],"kty":"RSA","n":"0K01EkQI0vpz6dk2vhm4ztZz6HkjLx_9nhLE0OGTcpBCbFW1CLlViWA0GId00I4jVfM1YNoUgGqz_3pW6P53lO0kvzHMmb4R8sxhgXSpCHY1DKYU4XDP3vqSzNWBDyFrhaLqTrLWuWMGw_6euqB2wRrOxhrf7flvWg0Kk6Kuj7IUPnnybBfFClIHmHxdi1S5MRegOgC4zpMw67bHiF1qCeS9qEFo0a4RvLvQd5cF2GStmL3E_nwsIEl17KukzuLw0jD8Ac_FZX7Y5nkQZJRKr6HpHJrnRB1KfV2y9CYWEr7SFjq9kUsq_8T8rs-m2ye-DYxjBwniuxZmjTCyywwHbiSg92WKaFXcc72VT572xWQ_0UAdaejmaK8k-eTf2kX4w_CDRO6uXmQtQGZ_07Sp_PzZ6L8Hyc_yWc51NUsmHbmR_NHghju201TrAe8uLvi4V6vXyiH1QqR8AAeA2nGLnDwDA0boodyavxostBrtDJPqcSaTdF5BDQ8GdYLZRbj6rWYe28vDH_br5rxsN1xZG1ycx7aM3UT8hHsSg3mHdvyljVgp3WyrQb3-E_M8diH_I6gJ7m8pNBcVTwrXQqq9DTfFbBv61KOCWJ0zPUYdAzR_d431dcPSZmmao9nAB7LauZG5eEG2Ga0Zsk75301jSVYuHu-wa0cZSMBNzajYajM","p":"-tz8q6IjYbDZl_WLHL6Al4fdP3QwE6IdSjILV08004Pf2u93xX5wJ2RYiLMs6wdq2q557vEtoaga0MnIQ7PAUMbarC0Xarzbd8bUaYlfDjeJRzHGrGrlN4hq9ABaS6w1iSbTQHZe1PjbbyFE7EDjAuQCIQBeU2vUuVOrix3hAKCwOY1eA7Qmdf1X3k7Ey2ey4rwdMD3a0bmk3nH-6Lw88PeXzndUYcL4vlGHwbHjfdW8xo9v7_qLFUH8-vIqlfL1VVBYlW40Nb6uHpuXmneWKS0Wt80fdIvrH8KfYQN265lJ2KEdSWQDoaB8WeCOBgH_6sT-iun-F0HAf4ep_vfTxw","q":"1PMUeXcLSTldXnkoYdgyRq6dJhljgNHtueZr1mEAjiAVyFwm9Xh2nlBQ-Zzy1ifnZ4fUrH61c-uJNhzK-8FRWy1PB9H73oslnqxSCwhhLxtOIEQ3JTCkutDpqZ81lVBnGwKe8O3FiM6FnX9Y2uD5KK2dBSOgUtlIpfHAiqoF5F0EsMR-gQUiWf5VQ0DjrXLIU6TMhFjzRc_Ufon0no4FupQAhelGA-NJQOf74M8Sto5zP32o2Q9GC2dm6B_GgiBrMXHE1c6tbHeK15iduLZt3epPS9hHJFygqYbUwf2PLDdndxFvovnL2n8ekPteD75DmrHiLrUGlZk1nwNhlQXeNQ","qi":"Ce-Z3SqqljsMYhM_0YuNXEGZXI92sTBzJ77npZZLs98owWbSj6n4C45g1xNLK1whoSokWZgCAeqHNrZyogyA4br6wSqqBYriyTT80Bt8nEFHpnDNRuMuQ8z_9mKA-mX6x_2e81lTg12830AZW4dHXPgC9yP8fV3D0hyQdeaKFzbWY2QKq78JrdNhpYA8izN4Rfi5YNnMI8l-SkpvsxX8Uo31tWY-C2qPCazRk9X3hpmavado3gfEBLWHbUKwyOEwj2-a4SE-v9djdiY-ZnarnewZ0gy9sK-plcYVy-vzX4We0TGlHQY58R8ScXc_D2GDhmqCHbSslhAqg_J_7twmPA"}
        
        {"alg":"RSA-OAEP-512","e":"AQAB","ext":true,"key_ops":["encrypt"],"kty":"RSA","n":"0K01EkQI0vpz6dk2vhm4ztZz6HkjLx_9nhLE0OGTcpBCbFW1CLlViWA0GId00I4jVfM1YNoUgGqz_3pW6P53lO0kvzHMmb4R8sxhgXSpCHY1DKYU4XDP3vqSzNWBDyFrhaLqTrLWuWMGw_6euqB2wRrOxhrf7flvWg0Kk6Kuj7IUPnnybBfFClIHmHxdi1S5MRegOgC4zpMw67bHiF1qCeS9qEFo0a4RvLvQd5cF2GStmL3E_nwsIEl17KukzuLw0jD8Ac_FZX7Y5nkQZJRKr6HpHJrnRB1KfV2y9CYWEr7SFjq9kUsq_8T8rs-m2ye-DYxjBwniuxZmjTCyywwHbiSg92WKaFXcc72VT572xWQ_0UAdaejmaK8k-eTf2kX4w_CDRO6uXmQtQGZ_07Sp_PzZ6L8Hyc_yWc51NUsmHbmR_NHghju201TrAe8uLvi4V6vXyiH1QqR8AAeA2nGLnDwDA0boodyavxostBrtDJPqcSaTdF5BDQ8GdYLZRbj6rWYe28vDH_br5rxsN1xZG1ycx7aM3UT8hHsSg3mHdvyljVgp3WyrQb3-E_M8diH_I6gJ7m8pNBcVTwrXQqq9DTfFbBv61KOCWJ0zPUYdAzR_d431dcPSZmmao9nAB7LauZG5eEG2Ga0Zsk75301jSVYuHu-wa0cZSMBNzajYajM"}        

    C. Use public key to encrypt a test phrase. 
        const pubStr = '{"alg":"RSA-OAEP-512","e":"AQAB","ext":true,"key_ops":["encrypt"],"kty":"RSA","n":"0K01EkQI0vpz6dk2vhm4ztZz6HkjLx_9nhLE0OGTcpBCbFW1CLlViWA0GId00I4jVfM1YNoUgGqz_3pW6P53lO0kvzHMmb4R8sxhgXSpCHY1DKYU4XDP3vqSzNWBDyFrhaLqTrLWuWMGw_6euqB2wRrOxhrf7flvWg0Kk6Kuj7IUPnnybBfFClIHmHxdi1S5MRegOgC4zpMw67bHiF1qCeS9qEFo0a4RvLvQd5cF2GStmL3E_nwsIEl17KukzuLw0jD8Ac_FZX7Y5nkQZJRKr6HpHJrnRB1KfV2y9CYWEr7SFjq9kUsq_8T8rs-m2ye-DYxjBwniuxZmjTCyywwHbiSg92WKaFXcc72VT572xWQ_0UAdaejmaK8k-eTf2kX4w_CDRO6uXmQtQGZ_07Sp_PzZ6L8Hyc_yWc51NUsmHbmR_NHghju201TrAe8uLvi4V6vXyiH1QqR8AAeA2nGLnDwDA0boodyavxostBrtDJPqcSaTdF5BDQ8GdYLZRbj6rWYe28vDH_br5rxsN1xZG1ycx7aM3UT8hHsSg3mHdvyljVgp3WyrQb3-E_M8diH_I6gJ7m8pNBcVTwrXQqq9DTfFbBv61KOCWJ0zPUYdAzR_d431dcPSZmmao9nAB7LauZG5eEG2Ga0Zsk75301jSVYuHu-wa0cZSMBNzajYajM"}'
        const pubJs  = JSON.parse(pubStr);        
        const param  = {
          name: 'RSA-OAEP',
          modulusLength: 4096,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-512'
        };        
        const pubK   = await window.crypto.subtle.importKey('jwk', pubJs, param, false, ['encrypt',]);        
        const eStr   = await asymEncrypt('test phrase', pubK);        
        console.log(eStr);        
        console.log(wrap(eStr));
            
        wozDlcOVwo/DjMKqGUI6w5hWVsKEEcOuc8K5wo1CFcK/w4HDrmrCsQ3Ck17CuU88wpZ/w5XDm8KewprDlMKNw5I0T8KTb3HDicKqBm/CkSPCpsOjwolbSMOaPsO+w7bCrMOfHi3Cm20gIzYBccKKwqbDvm7DpClSMEYFw6UPVXbCqsKJw67DgEzDjiwJw44pZAMJwr/DpnHCmMKFwpgPw5TDn8OKJcO9w7TCpDfDrBUMw4zDuMOPWsOhU8Kiw5Z8AWLDqVLDrcOCw4bCo8OiPT7CryjDs8OywokwR8K0JSLCqCzCiMKOwpzDoMOCwp0OdcOYOBBNZQnCoMK5wrLDpiI0asK+w7AjAjvCp8Ohwo/ChzvDnVrDtMKXdMKoOcO0wp3Cq8K4TzIKMBXDpQnCu8K1fMOBYiXChGPCsXANw7PCnQjDmcOOUMOww4QEW1JeBsOKOMOQGCLCjRdkwrYCwrRjUQ/DuGkGw6clHsOgw758wqTDnFLDtMOjw6UidMOvw43Dm1gmwpdMcsO1wrDCh8KkwrR0ecKTMcOAS8KewoslwoLCncKOw4nDuxYLVcKbdsKPw6tUwpXCkS/DoyzCoUTCm8OZJwo9wrNpU8KdcyjCoGMJHUpQwpxiw6zCq8KqeVpACsKcw57Cn2sBW8OkwoF+HcOtw6ZyZ2PDr13CiMOfw7TDim/DlsOow4dlw5wqGTddPsO4w6fDnsOVwqpFwoDDgVHCg8KnwpHDunEabhjDjMKkw7MswoMdw7cYwr7Du1LDsl5xwpHDo13DjMO+wqE3w4fCgUbCmMOmKWTDsCJ9QcOsTlZLw41bRMKlw4XDlhPCshzDoMK2w4UKVzXDucOHw4U/wonCkXVLwp7Cj1MCGMO2w6UQHAvCm8KBJ8OiwoPDk8KgblLDvsOwCcOgwrzCvDh/woNfwpJ7woLCmMOnYCpoFHfCmsK2wqLCo3M0w5RQGsKOw6XCg8OEw6FTwqrDt8KQw6XDv8O3w7fDuAY3fETDvsObw7QKM8OgwqpTwq7DuMKyw77ChsKtD1rCtMOf


    D. Encrypt private key with password-derived user key. 
        const priK    = '{"alg":"RSA-OAEP-512","d":"Kp6FjVJ53uUqEWO8q3zDYvMnvx4mknRdLxC0Q9kebTKLbmbez4ZSsvkECtJ3iDTPgLloeHxx3XxtgMsyvulh8PeyHp6EJA5OyiD19SOndkP2N7wf3Z9VxTu2CcG9VyLDPAr3AdXCxyAzfIofTwyA1JWuD4XjoE3mcSTiuR5ruotrWQs8-Nit9JqmVH1p-Y_3NtCVd-M323Dyd-HfxLkXdCfUmG2rg8-ibcKKJDKjDfwZ_G0ds8AWnw2B2TGBOoPdHYDFp3UQ4tbSY9fsAi7LRi2yV5ZHj4DP-uTNLNIuheuVKtcaandIs-4-kVF1yaLHTSsT-pcJSJ6dmU6N5axyQ6za8XvN5DJGwSUHfLGcDYx0kdmXsPWUWg8aQgQ55dqAe5YHvJkpanPiOyclmwIqVn5B9bQ5TPVZbJTyS6RJp6WMS1b5-akL-0Ko5hmXo4IAi_7rXng2quMu84VvbvQxUIBp_hi_84WYk8f-iXzZrexR36oZGZjXCrABo_QzrQNs0i8uwiB3IQsh2xIG4-QQs5K7fW83Gwh0S5v8ja-y0mGSBJmeXGMtoTIMIVFrygf0Mrgt1FDWbjbX-bIoua1TnCKXA1ZTpTLpojlQMwZpy5IxhAuUqFRiaLV_f1g6kJBirycVFLFck-KG4YogF9GQKRrkof8W9Lah7ex9w3fQ5_k","dp":"1UM8wiRKc-hGczrZEoyZATkNS75YiLhOsh6tKYI6ZH49tf_SEGEWs0ZJRZ0c2Ikru9CL9CewJTel5E1GJNgQ7BrBF5IV0DXRVZgAR9_yoUFxQMb-IOGXD4i3c8tA-AfkUz5gZPK8V81frq_Xygi3dGOls6x-g-itpQeOU-wIteHlLmgRvpBOCgxfwKux_UGg_8PwBGzxM03g7QJ4NB6iqC-0LF-hqqJ3mEPzZyT1QqqLmzmhbZ_O0TmR-TwaG_O5wNdXF2HinLYHjBm13ik_zK16HLMSxJ-WOR_ZIj4xwMRF1RXSseuGcsbeMAIIeu8EQu9JfYrC6b6KCWCpkgnZTQ","dq":"fWTR9qBpzelwmJPhepQzLrndobSrigyT3rbXYzpleEteaEgTTNJtjtWeiQ2pVP_UXHt4eUZ3lNXqSynzQQHZ5UWt1t4IYUgwk9nGyeZaS8HZZFim3Ehjh_pCzXYJuG3K-PW3IAnzGpb5yP9XFDQLo69v2bnby01VYRoVFdH-fDVl8K0UDOc4DiQckuif6N_BJLfTEk_KmJ5D82tK1x6sMuy5ziDJ8LoixYyVHhDxZPxG0uksxvwec9KknyUu4Cs00725eWklZ8yQvlmI7l7GHTm_DdtCMSA2Hv1dRQoJB7FsRInI4gAT0QqvthG-lqij6HC8zmIciXTZRVRZXsZAzQ","e":"AQAB","ext":true,"key_ops":["decrypt"],"kty":"RSA","n":"0K01EkQI0vpz6dk2vhm4ztZz6HkjLx_9nhLE0OGTcpBCbFW1CLlViWA0GId00I4jVfM1YNoUgGqz_3pW6P53lO0kvzHMmb4R8sxhgXSpCHY1DKYU4XDP3vqSzNWBDyFrhaLqTrLWuWMGw_6euqB2wRrOxhrf7flvWg0Kk6Kuj7IUPnnybBfFClIHmHxdi1S5MRegOgC4zpMw67bHiF1qCeS9qEFo0a4RvLvQd5cF2GStmL3E_nwsIEl17KukzuLw0jD8Ac_FZX7Y5nkQZJRKr6HpHJrnRB1KfV2y9CYWEr7SFjq9kUsq_8T8rs-m2ye-DYxjBwniuxZmjTCyywwHbiSg92WKaFXcc72VT572xWQ_0UAdaejmaK8k-eTf2kX4w_CDRO6uXmQtQGZ_07Sp_PzZ6L8Hyc_yWc51NUsmHbmR_NHghju201TrAe8uLvi4V6vXyiH1QqR8AAeA2nGLnDwDA0boodyavxostBrtDJPqcSaTdF5BDQ8GdYLZRbj6rWYe28vDH_br5rxsN1xZG1ycx7aM3UT8hHsSg3mHdvyljVgp3WyrQb3-E_M8diH_I6gJ7m8pNBcVTwrXQqq9DTfFbBv61KOCWJ0zPUYdAzR_d431dcPSZmmao9nAB7LauZG5eEG2Ga0Zsk75301jSVYuHu-wa0cZSMBNzajYajM","p":"-tz8q6IjYbDZl_WLHL6Al4fdP3QwE6IdSjILV08004Pf2u93xX5wJ2RYiLMs6wdq2q557vEtoaga0MnIQ7PAUMbarC0Xarzbd8bUaYlfDjeJRzHGrGrlN4hq9ABaS6w1iSbTQHZe1PjbbyFE7EDjAuQCIQBeU2vUuVOrix3hAKCwOY1eA7Qmdf1X3k7Ey2ey4rwdMD3a0bmk3nH-6Lw88PeXzndUYcL4vlGHwbHjfdW8xo9v7_qLFUH8-vIqlfL1VVBYlW40Nb6uHpuXmneWKS0Wt80fdIvrH8KfYQN265lJ2KEdSWQDoaB8WeCOBgH_6sT-iun-F0HAf4ep_vfTxw","q":"1PMUeXcLSTldXnkoYdgyRq6dJhljgNHtueZr1mEAjiAVyFwm9Xh2nlBQ-Zzy1ifnZ4fUrH61c-uJNhzK-8FRWy1PB9H73oslnqxSCwhhLxtOIEQ3JTCkutDpqZ81lVBnGwKe8O3FiM6FnX9Y2uD5KK2dBSOgUtlIpfHAiqoF5F0EsMR-gQUiWf5VQ0DjrXLIU6TMhFjzRc_Ufon0no4FupQAhelGA-NJQOf74M8Sto5zP32o2Q9GC2dm6B_GgiBrMXHE1c6tbHeK15iduLZt3epPS9hHJFygqYbUwf2PLDdndxFvovnL2n8ekPteD75DmrHiLrUGlZk1nwNhlQXeNQ","qi":"Ce-Z3SqqljsMYhM_0YuNXEGZXI92sTBzJ77npZZLs98owWbSj6n4C45g1xNLK1whoSokWZgCAeqHNrZyogyA4br6wSqqBYriyTT80Bt8nEFHpnDNRuMuQ8z_9mKA-mX6x_2e81lTg12830AZW4dHXPgC9yP8fV3D0hyQdeaKFzbWY2QKq78JrdNhpYA8izN4Rfi5YNnMI8l-SkpvsxX8Uo31tWY-C2qPCazRk9X3hpmavado3gfEBLWHbUKwyOEwj2-a4SE-v9djdiY-ZnarnewZ0gy9sK-plcYVy-vzX4We0TGlHQY58R8ScXc_D2GDhmqCHbSslhAqg_J_7twmPA"}';        
        const [s, pk] = await passKey('Kropotkin', 'RMOjwp7DvkYfMsOaTRpFw5skw5HCsMOd');        
        const [s2, h] = await ndhash('Kropotkin', 32, 'YlbDqsKpQcKICsOUwrfCth4gHyBqw6I=');        
        const ePriK   = await encrypt(priK, pk, wrap(h));        
        console.log(ePriK);    
        bMKbw7xNO8KzHsKEwoDDhsOQIg==-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    

    E. Recover (decrypt) private key 
        const ePriK   = 'bMKbw7xNO8KzHsKEwoDDhsOQIg==-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';        
        const [s, pk] = await passKey('Kropotkin', 'RMOjwp7DvkYfMsOaTRpFw5skw5HCsMOd');        
        const [s2, h] = await ndhash('Kropotkin', 32, 'YlbDqsKpQcKICsOUwrfCth4gHyBqw6I=');        
        const priKeyJs = await decrypt(ePriK, pk, wrap(h));        
        console.log(priKeyJs);
    
    F. Use private key to decrypt test phrase 
        const ePriK    = 'bMKbw7xNO8KzHsKEwoDDhsOQIg==-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';       
        const [s, pk]  = await passKey('Kropotkin', 'RMOjwp7DvkYfMsOaTRpFw5skw5HCsMOd');        
        const [s2, h]  = await ndhash('Kropotkin', 32, 'YlbDqsKpQcKICsOUwrfCth4gHyBqw6I=');        
        const priKeyJs = await decrypt(ePriK, pk, wrap(h));
        const param  = {
          name: 'RSA-OAEP',
          modulusLength: 4096,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: 'SHA-512'
        };                
        const privKey  = await window.crypto.subtle.importKey('jwk', priKeyJs, param, false, ['decrypt',]);
        const encStr   = 'wozDlcOVwo/DjMKqGUI6w5hWVsKEEcOuc8K5wo1CFcK/w4HDrmrCsQ3Ck17CuU88wpZ/w5XDm8KewprDlMKNw5I0T8KTb3HDicKqBm/CkSPCpsOjwolbSMOaPsO+w7bCrMOfHi3Cm20gIzYBccKKwqbDvm7DpClSMEYFw6UPVXbCqsKJw67DgEzDjiwJw44pZAMJwr/DpnHCmMKFwpgPw5TDn8OKJcO9w7TCpDfDrBUMw4zDuMOPWsOhU8Kiw5Z8AWLDqVLDrcOCw4bCo8OiPT7CryjDs8OywokwR8K0JSLCqCzCiMKOwpzDoMOCwp0OdcOYOBBNZQnCoMK5wrLDpiI0asK+w7AjAjvCp8Ohwo/ChzvDnVrDtMKXdMKoOcO0wp3Cq8K4TzIKMBXDpQnCu8K1fMOBYiXChGPCsXANw7PCnQjDmcOOUMOww4QEW1JeBsOKOMOQGCLCjRdkwrYCwrRjUQ/DuGkGw6clHsOgw758wqTDnFLDtMOjw6UidMOvw43Dm1gmwpdMcsO1wrDCh8KkwrR0ecKTMcOAS8KewoslwoLCncKOw4nDuxYLVcKbdsKPw6tUwpXCkS/DoyzCoUTCm8OZJwo9wrNpU8KdcyjCoGMJHUpQwpxiw6zCq8KqeVpACsKcw57Cn2sBW8OkwoF+HcOtw6ZyZ2PDr13CiMOfw7TDim/DlsOow4dlw5wqGTddPsO4w6fDnsOVwqpFwoDDgVHCg8KnwpHDunEabhjDjMKkw7MswoMdw7cYwr7Du1LDsl5xwpHDo13DjMO+wqE3w4fCgUbCmMOmKWTDsCJ9QcOsTlZLw41bRMKlw4XDlhPCshzDoMK2w4UKVzXDucOHw4U/wonCkXVLwp7Cj1MCGMO2w6UQHAvCm8KBJ8OiwoPDk8KgblLDvsOwCcOgwrzCvDh/woNfwpJ7woLCmMOnYCpoFHfCmsK2wqLCo3M0w5RQGsKOw6XCg8OEw6FTwqrDt8KQw6XDv8O3w7fDuAY3fETDvsObw7QKM8OgwqpTwq7DuMKyw77ChsKtD1rCtMOf';        
        const phrase   = await asymDecrypt(encStr, privKey);
        
        console.log(phrase);    
        test phrase

  */


import { Base64 } from 'js-base64';

const arrayBufferToString = (buf) => {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

const stringToArrayBuffer = (str) => {
    const buf = new ArrayBuffer(str.length); 
    const bufView = new Uint8Array(buf);
    for (let i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
};

const wrapString = (str) => {
  return Base64.encode(str);
};

const unwrapString = (str) => {
  return Base64.decode(str);
};

export const wrap = (buf) => { return wrapString(arrayBufferToString(buf)); }

export const unwrap = (str) => { return stringToArrayBuffer(unwrapString(str)); }

export const key = async() => {
  const input  = window.crypto.getRandomValues(new Uint8Array(32));
  const k      = await window.crypto.subtle.importKey("raw", input, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
  
  return k;
};

export const passKey = async (pass, salt=false) => {
  const [s, h] = await ndhash(pass, 32, salt);  
  const k      = await window.crypto.subtle.importKey("raw", h, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
    
  return [wrap(s), k];
};

export const ndhash = async (pwd, len=16, salt=false) => {
  const s = salt ? unwrap(salt) : window.crypto.getRandomValues(new Uint8Array(16));
  const h = await argon2.hash({ pass: pwd, salt: s, time: 11, mem: 4096, hashLen: len, type: 'Argon2id' });
  
  return [s, h.hash];
};

const makeIV = () => {
  const array = new Uint8Array(12);
  return window.crypto.getRandomValues(array);
};

export const encrypt = async (str, key, auth, subtle=window.crypto.subtle) => {
  if ('' === str) { return ''; }
  
  if ('object' === typeof(str)) { 
    str = JSON.stringify(str);
  }

  const enc    = new TextEncoder();
  
  const iv     = makeIV();
  
  const encStr = enc.encode(str);
  
  const buff   = await subtle.encrypt({ 
    name           : 'AES-GCM', 
    iv             : iv, 
    additionalData : stringToArrayBuffer(auth),
    tagLength      : 128    
  }, key, encStr);
  
  return wrapString(arrayBufferToString(iv)) + '-' + wrapString(arrayBufferToString(buff));
};

export const decrypt = async (str, key, auth, subtle=window.crypto.subtle) => {
  if ('' === str) { return ''; }
  
  const dec    = new TextDecoder();

  const [wrappedIV, wrappedStr] = str.split('-');
  
  const iv     = unwrap(wrappedIV);
  
  const buff   = await subtle.decrypt({ 
    name           : 'AES-GCM', 
    iv             : iv, 
    additionalData : stringToArrayBuffer(auth),
    tagLength      : 128    
  }, key, unwrap(wrappedStr));
  
  const decode = dec.decode(buff);

  try {
    return JSON.parse(decode);
  }
  catch (e) {
    return decode;
  }  
};


