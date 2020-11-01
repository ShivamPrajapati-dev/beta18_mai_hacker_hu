package com.example.locnavigator;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.telephony.SmsManager;
import android.telephony.SmsMessage;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;
import org.json.JSONTokener;

import java.util.ArrayList;
import java.util.List;

public class SecondActivity extends AppCompatActivity implements ReceiveSMS.MessageListener {
    private String phoneNo = "+918960507109";
    String msg;
    String key = "mai_hacker_hu";
    String json;
    Double lat=0.0;
   Double longt=0.0;
    String dest;
    ArrayList<location> a = new ArrayList<>();
    RecyclerView recyclerView;
    RecyclerView.Adapter adapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);

        ReceiveSMS.bindListener(this);
        recyclerView = findViewById(R.id.recycle);
         adapter = new RecycleAdapter(a);
        LinearLayoutManager l = new LinearLayoutManager(SecondActivity.this);
        l.setOrientation(LinearLayoutManager.VERTICAL);
        recyclerView.setLayoutManager(l);
        recyclerView.setAdapter(adapter);

        Intent intent = getIntent();
         lat = intent.getDoubleExtra("lat",0.0);
         longt = intent.getDoubleExtra("longt",0.0);
         dest = intent.getStringExtra("dest_string");

        Log.d("SDFSDFSD", " "+lat+" "+longt+" "+dest);
        if (!TextUtils.isEmpty(dest)) {

            json = "{" + "\n   \"key\":" + " \"" + key + "\"," + "\n \"lat\":" + "\"" + lat + "\"," + "\n \"log\":" + " \"" + longt + "\" ," + "\n \"destination\":" + "\"" + dest + "\"" + "\n}";
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Log.d("zxzxzxzxzxd", json);
                if (ActivityCompat.checkSelfPermission(SecondActivity.this, Manifest.permission.SEND_SMS) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(new String[]{Manifest.permission.SEND_SMS}, 10);
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return;
                }
                sendSMS(phoneNo, json);
            } else {
                sendSMS(phoneNo, json);
            }

        } else {
            Toast.makeText(SecondActivity.this, "Please enter your location", Toast.LENGTH_SHORT).show();
        }
    }



    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case 10:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    sendSMS(phoneNo, json);
                }

        }
    }

    public void sendSMS(String phoneNo, String msg) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(phoneNo, null, msg, null, null);
            Toast.makeText(getApplicationContext(), "Message Sent",
                    Toast.LENGTH_LONG).show();
            Log.d("msgwerer", "@#$@#$");

        } catch (Exception ex) {
            Toast.makeText(getApplicationContext(), ex.getMessage().toString(),
                    Toast.LENGTH_LONG).show();
            ex.printStackTrace();
        }
    }




    @Override
    public void messageReceived(location l1) {
        Log.d("aa bhi ja", "aa gya");
        a.add(l1);
        adapter.notifyDataSetChanged();

    }
}
