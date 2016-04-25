package codes.saten.nodemessagingapi;

import com.google.gson.annotations.SerializedName;

public class BaseResponse {
    private Meta meta;
    private Object data;

    public class Meta {
        @SerializedName("error_type") private String errorType;
        private int code;
        @SerializedName("error_message") private String errorMessage;

        public String getErrorType() {
            return errorType;
        }

        public int getCode() {
            return code;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }

    public Meta getMeta() {
        return meta;
    }

    public Object getData() {
        return data;
    }
}
