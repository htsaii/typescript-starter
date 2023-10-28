import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Event } from './event.model'; // Import the Event type from your model
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async addEvent(@Body() eventData: Event) {
    // add the current time to the event data
    eventData.createdAt = new Date();
    eventData.updatedAt = new Date();

    const generatedId = await this.eventsService.insertEvent(eventData);
    return { id: generatedId };
  }

  @Get()
  async getAllEvents() {
    const events = await this.eventsService.getEvents();
    return events;
  }

  @Get(':id')
  getEvent(@Param('id') eveId: string) {
    return this.eventsService.getSingleEvent(eveId);
  }

  @Patch()
  async mergeEvent() {
    await this.eventsService.mergeAll();
    return null;
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') eveId: string,
    @Body() eventData: Partial<Event>,
  ) {
    // update the current time to the event data
    eventData.updatedAt = new Date();
    await this.eventsService.updateEvent(eveId, eventData);
    return null;
  }

  @Delete(':id')
  async removeEvent(@Param('id') eveId: string) {
    const result = await this.eventsService.deleteEvent(eveId);
    return result;
  }
}
