$(() => {
    let roomId;
    //window.setInterval(getMessages, 1000);
    $.ajax({
        type: "GET",
        url: "/api/rooms",
        success : (rooms) => {
            roomId = rooms[0].id;
            getMessages();
            $.each(rooms, function (key, room) {
                var a = '<a href="#" data-room-id="' + room.id + '" class="room list-group-item">' + room.name + '</a>';
                $("#rooms").append(a);
            });
        }
    });

    $("#post").click(() => {
        var message = {text: $("#message").val()};

        $.ajax({
            type: "POST",
            url: "/api/rooms/" + roomId + "/messages",
            data: JSON.stringify(message),
            contentType: "application/json",
            success: () => {
                $("#message").val("");
                getMessages();
            }
        });
    });

    $('body').on('click', 'a.room', (event) => {
        roomId = $(event.target).attr("data-room-id");
        getMessages();
    });

    function getMessages() {
        $.ajax({
            type: "GET",
            url: "/api/rooms/" + roomId + "/messages",
            success : (data) => {
                $("#roomName").text("Messages for " + data.room.name);
                var messages = "";
                $.each(data.messages, (key, message) => {
                    messages += message.text + "\r";
                });
                $("#messages").val(messages);
            }
        });
    }

    $("#delete").click(() => {
        $.ajax({
            type: "DELETE",
            url: "/api/rooms/" + roomId + "/messages",
            success: () => {
                $("#messages").val("");
            }
        });
    });


});
