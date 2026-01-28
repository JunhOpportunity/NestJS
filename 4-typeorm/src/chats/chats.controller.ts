import { Controller, Get, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { paginateChatDto } from './dto/paginate-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  paginateChat(
    @Query() dto: paginateChatDto
  ) {
    return this.chatsService.paginateChats(dto);
  }
}
