package com.chatapp.service;

import com.chatapp.model.Session;
import com.chatapp.repository.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
    @Autowired
    private SessionRepository sessionRepository;

    public Session save(Session session) {
        return sessionRepository.save(session);
    }
}
