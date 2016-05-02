package codes.saten.nodemessagingapi;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.view.animation.LinearOutSlowInInterpolator;
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

public class MessagesFragment extends Fragment implements View.OnClickListener,
        Callback<BaseResponse> {
    private MainActivity activity;
    private EditText recipient, message;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        activity = (MainActivity) getActivity();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        LinearLayout root = (LinearLayout) inflater.inflate(R.layout.fragment_messages, container,
                false);
        recipient = (EditText) root.findViewById(R.id.recipient);
        message = (EditText) root.findViewById(R.id.message);
        Button submit = (Button) root.findViewById(R.id.submit);
        submit.setOnClickListener(this);
        return root;
    }

    @Override
    public void onClick(View v) {
        MessagingService service = activity.getMessagingService();
        String token = activity.getToken();

        String email = recipient.getText().toString();
        String text = message.getText().toString();

        service.sendMessage(token, email, text).enqueue(this);
    }

    @Override
    public void onResponse(Call<BaseResponse> call, Response<BaseResponse> response) {
        if (response.body() != null) {
            Toast.makeText(getContext(), "SUCCESS", Toast.LENGTH_SHORT).show();
        }
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
