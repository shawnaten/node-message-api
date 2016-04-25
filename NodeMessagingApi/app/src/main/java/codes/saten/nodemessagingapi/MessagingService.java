package codes.saten.nodemessagingapi;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface MessagingService {
    @GET("auth")
    Call<JWTResponse> auth(
            @Header("Authorization") String authorization,
            @Query("device_name") String device
    );

    @POST("auth/test/login")
    Call<Void> loginTest(
            @Header("Authorization") String authorization
    );

    @POST("auth/test/token")
    Call<Void> tokenTest(
            @Header("Authorization") String authorization
    );

    @POST("user/create")
    Call<BaseResponse> createUser(
            @Query("name") String name,
            @Query("nick") String username,
            @Query("email") String email,
            @Query("password") String password
    );

    @POST("user/verify")
    Call<Void> verifyUser(
            @Query("token") String token
    );

    @POST("chat/support/start")
    Call<ChatResponse> startSupportChat(
            @Header("Authorization") String authorization,
            @Query("topic") String topic
    );

    @POST("user/delete")
    Call<Void> deleteUser(
            @Header("Authorization") String authorization
    );

    @GET("chat/support/list")
    Call<ChatList> listSupportChats(
            @Header("Authorization") String authorization
    );

    @POST("chat/support/remove")
    Call<Void> removeSupportChat(
            @Header("Authorization") String authorization,
            @Query("id") String chatId
    );

    @POST("message/post")
    Call<Void> postMessage(
            @Header("Authorization") String authorization,
            @Query("id") String chatId,
            @Query("text") String text
    );

    @GET("message/list")
    Call<MessageList> listMessages(
            @Header("Authorization") String authorization,
            @Query("id") String chatId
    );

    @POST("broadcast/post")
    Call<Void> postBroadcast(
            @Header("Authorization") String authorization,
            @Query("title") String title,
            @Query("text") String text,
            @Query("expires") int expires
    );

    @GET("broadcast/list")
    Call<BroadcastList> listBroadcasts(
            @Header("Authorization") String authorization
    );

}
