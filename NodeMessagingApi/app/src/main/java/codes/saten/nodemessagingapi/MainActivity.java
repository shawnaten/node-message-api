package codes.saten.nodemessagingapi;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import retrofit2.GsonConverterFactory;
import retrofit2.Retrofit;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    protected void onResume() {
        super.onResume();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://104.236.19.246/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        MessagingService service = retrofit.create(MessagingService.class);
    }
}
