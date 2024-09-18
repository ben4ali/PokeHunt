package com.pokehunt.pokehunt_sb.controller;

import com.pokehunt.pokehunt_sb.entities.PlayerPosition;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class PlayerController {

    @MessageMapping("/player.sendPosition")
    @SendTo("/topic/public")
    public PlayerPosition sendPosition(@Payload PlayerPosition position){
        return position;
    }

    @MessageMapping("/player.addUser")
    @SendTo("/topic/public")
    public PlayerPosition addPlayer(@Payload PlayerPosition player, SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("username", player.getUsername());
        return player;
    }

}
