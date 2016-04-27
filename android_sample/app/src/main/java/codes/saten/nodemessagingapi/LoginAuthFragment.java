package codes.saten.nodemessagingapi;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.w3c.dom.Text;

import codes.saten.nodemessagingapi.model.AuthResponse;
import codes.saten.nodemessagingapi.model.BaseResponse;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginAuthFragment extends Fragment implements View.OnClickListener,
        Callback<AuthResponse> {

    private EditText email, password;
    private MessagingService messagingService;
    private TextView authStatus;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        messagingService = ((MainActivity) getActivity()).getMessagingService();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        LinearLayout root;
        Button submit;

        root = (LinearLayout) inflater.inflate(R.layout.fragment_login_auth, container, false);

        email = (EditText) root.findViewById(R.id.email);
        password = (EditText) root.findViewById(R.id.password);
        submit = (Button) root.findViewById(R.id.submit);
        authStatus = (TextView) root.findViewById(R.id.auth_status);

        submit.setOnClickListener(this);

        return root;
    }

    @Override
    public void onResume() {
        MainActivity activity = (MainActivity) getActivity();

        super.onResume();

        if (activity.getToken() == null)
            authStatus.setText("App is NOT authorized.");
        else
            authStatus.setText("App IS ALREADY authorized.");
    }

    @Override
    public void onClick(View v) {
        String basicAuthHeader = AuthHeaders.genBasicAuthHeader(email.getText().toString(),
                password.getText().toString());

        messagingService.auth(basicAuthHeader, android.os.Build.MODEL).enqueue(this);
    }

    @Override
    public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
        if (response.body() != null) {
            ((MainActivity) getActivity()).setToken(response.body().getAccessToken());
            authStatus.setText("App IS ALREADY authorized.");
            Toast.makeText(getContext(), "SUCCESS", Toast.LENGTH_SHORT).show();
        }
        else
            Toast.makeText(getContext(), "STATUS: " + Integer.toString(response.code()),
                    Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFailure(Call<AuthResponse> call, Throwable t) {
        t.printStackTrace();
        Toast.makeText(getContext(), "FAILURE", Toast.LENGTH_SHORT).show();
    }
}
