package codes.saten.nodemessagingapi;

import codes.saten.nodemessagingapi.model.AuthResponse;
import codes.saten.nodemessagingapi.model.BaseResponse;
import codes.saten.nodemessagingapi.model.ChatListResponse;
import codes.saten.nodemessagingapi.model.ChatStartResponse;
import codes.saten.nodemessagingapi.model.KeyResponse;
import codes.saten.nodemessagingapi.model.MessageListResponse;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface MessagingService {

    // user endpoints
    @POST("user/create")
    Call<BaseResponse> createUser(@Query("name") String name, @Query("nick") String username,
                                  @Query("email") String email, @Query("password") String password);

    @POST("user/delete")
    Call<Void> deleteUser(@Header("Authorization") String basicAuth);

    // auth endpoints
    @GET("auth")
    Call<AuthResponse> auth(@Header("Authorization") String basicAuth,
                            @Query("device_name") String deviceName);

    // direct message endpoints
    @POST("message/send")
    Call<BaseResponse> sendMessage(@Header("Authorization") String tokenAuth,
                                   @Query("email") String email);

    @GET("message/list")
    Call<MessageListResponse> listMessages(@Header("Authorization") String tokenAuth);

    @POST("message/key")
    Call<BaseResponse> addKey(@Header("Authorization") String tokenAuth, @Query("key") String key);

    @GET("message/key")
    Call<KeyResponse> getKey(@Header("Authorization") String tokenAuth,
                             @Query("email") String email);

    // chat endpoints
    // not using right now
    @POST("chat/start")
    Call<ChatStartResponse> startChat(@Header("Authorization") String authorization,
                                      @Query("topic") String topic);

    @GET("chat/list")
    Call<ChatListResponse> listChats(@Header("Authorization") String authorization);

    @POST("chat/add")
    Call<BaseResponse> addUserToChat(@Header("Authorization") String authorization,
                                     @Query("email") String email);

    @POST("chat/leave")
    Call<BaseResponse> leaveChat(@Header("Authorization") String authorization);

}
