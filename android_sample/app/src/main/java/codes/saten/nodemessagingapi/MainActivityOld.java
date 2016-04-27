package codes.saten.nodemessagingapi;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import codes.saten.nodemessagingapi.model.BaseResponse;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.GsonConverterFactory;
import retrofit2.Response;
import retrofit2.Retrofit;

public class MainActivityOld extends AppCompatActivity {
    public static final String BASE_URL_DEV = "http://192.168.99.100/";
    public static final String BASE_URL_PROD = "http://104.131.115.246/";

    public static final String NAME_1 = "First Person";
    public static final String NICK_1 = "fperson";
    public static final String EMAIL_1 = "first.person@maildrop.cc";

    public static final String NAME_2 = "Second Person";
    public static final String NICK_2 = "sperson";
    public static final String EMAIL_2 = "second.person@maildrop.cc";

    public static final String PASSWORD = "1234Password";
    public static final String DEVICE_NAME = "Test Device";
    public static final String TOPIC = "Test Topic";
    public static final String MESSAGE = "Test Message";
    public static final String KEY = "Test Key";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_old);
    }

    @Override
    protected void onResume() {
        super.onResume();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL_PROD) // Dr. Niu's class should use BASE_URL_PROD
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        MessagingService service = retrofit.create(MessagingService.class);

        Callback<BaseResponse> createUser = new Callback<BaseResponse>() {
            int userCount;

            @Override
            public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
                Log.i(call.request().url().toString(), Integer.toString(response.code()));
                userCount++;
                Log.i("Users created: ", Integer.toString(userCount));
            }

            @Override
            public void onFailure(Call<BaseResponse> call, Throwable t) {
                t.printStackTrace();
            }
        };

        service.createUser(NAME_1, NICK_1, EMAIL_1, PASSWORD).enqueue(createUser);
        service.createUser(NAME_2, NICK_2, EMAIL_2, PASSWORD).enqueue(createUser);
    }
}
