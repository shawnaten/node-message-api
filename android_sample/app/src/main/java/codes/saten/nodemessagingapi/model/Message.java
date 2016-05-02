package codes.saten.nodemessagingapi.model;

public class Message {
    private String id;
    private String from;
    private String date;
    private String text;

    public String getId() {
        return id;
    }

    public String getDate() {
        return date;
    }

    public String getText() {
        return text;
    }

    public String getFrom() {
        return from;
    }
}
