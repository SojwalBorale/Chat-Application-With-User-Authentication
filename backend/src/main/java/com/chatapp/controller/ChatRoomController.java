package com.chatapp.controller;

import com.chatapp.model.ChatRoom;
import com.chatapp.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chatrooms")
public class ChatRoomController {
    @Autowired
    private ChatRoomService chatRoomService;

    @PostMapping
    public ChatRoom createChatRoom(@RequestBody ChatRoom chatRoom) {
        return chatRoomService.save(chatRoom);
    }

    @GetMapping
    public List<ChatRoom> getAllChatRooms() {
        return chatRoomService.findAll();
    }
}
