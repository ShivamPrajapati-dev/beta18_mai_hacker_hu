package com.example.locnavigator;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;


import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;


public class RecycleAdapter extends RecyclerView.Adapter<RecycleAdapter.RecycleHolder> {

    private ArrayList<location> mEa;
    public class RecycleHolder extends RecyclerView.ViewHolder
    {
        private TextView t1;
        private ImageView t2;
        public RecycleHolder( View itemView) {
            super(itemView);
            t1=  (TextView)itemView.findViewById(R.id.text_dir);
            t2 = (ImageView) itemView.findViewById(R.id.op);
        }
    }
    public RecycleAdapter(ArrayList<location> a)
    {
        mEa=a;
    }

    @Override
    public RecycleHolder onCreateViewHolder( ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_message_received,parent,false);
        RecycleHolder recycleHolder = new RecycleHolder(view);
        return recycleHolder;
    }

    @Override
    public void onBindViewHolder(RecycleHolder holder, int position) {
        location b = mEa.get(position);
        holder.t1.setText(b.getComp_string());

        if(b.getTurn().equals("left"))
        {
            holder.t2.setBackgroundResource(R.drawable.left);
        }
        if(b.getTurn().equals("right"))
        {
            holder.t2.setBackgroundResource(R.drawable.right);
        }
        if(b.getTurn().equals("straight"))
        {
            holder.t2.setBackgroundResource(R.drawable.left);
        }
        if(b.getTurn().equals("slight left"))
        {
            holder.t2.setBackgroundResource(R.drawable.left);
        }
        if(b.getTurn().equals("slight right"))
        {
            holder.t2.setBackgroundResource(R.drawable.right);
        }
    }

    @Override
    public int getItemCount() {
        return mEa.size();
    }
}
