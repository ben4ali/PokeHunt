package com.pokehunt.pokehunt_sb.config;

import com.pokehunt.pokehunt_sb.entities.PlayerPosition;
import com.pokehunt.pokehunt_sb.enums.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.awt.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;


    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null){
            log.info("User disconnected :  {}",username);
            var playerPosition = PlayerPosition.builder()
                    .type(MessageType.LEAVE)
                    .username(username)
                    .build();
            messageTemplate.convertAndSend("/topic/public",playerPosition);
        }
    }
}
