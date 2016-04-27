package codes.saten.nodemessagingapi;

import android.util.Base64;

public class AuthHeaders {
    public static String genBasicAuthHeader(String email, String password) {
        String credentials = email + ":" + password;
        String encoded = Base64.encodeToString(credentials.getBytes(), Base64.DEFAULT);
        String header = "Basic " + encoded;
        return header.trim();
    }

    public static String genTokenAuthHeader(String token) {
        String header = "Bearer " + token;
        return header.trim();
    }
}
