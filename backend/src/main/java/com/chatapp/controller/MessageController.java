package com.chatapp.controller;

import com.chatapp.model.Message;
import com.chatapp.model.ChatRoom;
import com.chatapp.service.MessageService;
import com.chatapp.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;
    @Autowired
    private ChatRoomService chatRoomService;

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        return messageService.save(message);
    }

    @GetMapping("/chatroom/{chatRoomId}")
    public List<Message> getMessagesByChatRoom(@PathVariable Long chatRoomId) {
        ChatRoom chatRoom = chatRoomService.findAll().stream()
            .filter(room -> room.getId().equals(chatRoomId))
            .findFirst()
            .orElse(null);
        return messageService.getMessagesByChatRoom(chatRoom);
    }
}
