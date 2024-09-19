package com.pokehunt.pokehunt_sb.entities;

import com.pokehunt.pokehunt_sb.enums.MessageType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerPosition {
    String username;
    float x;
    float y;
    String sprite;
    private MessageType type;
}
