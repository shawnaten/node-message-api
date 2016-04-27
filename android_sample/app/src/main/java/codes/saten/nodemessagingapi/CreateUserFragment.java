package codes.saten.nodemessagingapi;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import codes.saten.nodemessagingapi.model.BaseResponse;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CreateUserFragment extends Fragment implements View.OnClickListener,
        Callback<BaseResponse> {
    private EditText name, nick, email, password;
    private MessagingService messagingService;

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

        root = (LinearLayout) inflater.inflate(R.layout.fragment_create_user, container, false);

        name = (EditText) root.findViewById(R.id.name);
        nick = (EditText) root.findViewById(R.id.nick);
        email = (EditText) root.findViewById(R.id.email);
        password = (EditText) root.findViewById(R.id.password);
        submit = (Button) root.findViewById(R.id.submit);

        submit.setOnClickListener(this);

        return root;
    }

    @Override
    public void onClick(View v) {
        messagingService.createUser(name.getText().toString(), nick.getText().toString(),
                email.getText().toString(), password.getText().toString()).enqueue(this);
    }

    @Override
    public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
        if (response.body() != null)
            Toast.makeText(getContext(), "MESSAGE: " + response.body().getMessage(),
                    Toast.LENGTH_SHORT).show();
        else
            Toast.makeText(getContext(), "STATUS: " + Integer.toString(response.code()),
                    Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFailure(Call<BaseResponse> call, Throwable t) {
        t.printStackTrace();
        Toast.makeText(getContext(), "FAILURE", Toast.LENGTH_SHORT).show();
    }
}
