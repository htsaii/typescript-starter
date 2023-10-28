import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.model';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<Event>,
  ) {}

  async insertEvent(eventData: Event): Promise<string> {
    const newEvent = new this.eventModel(eventData);
    // newEvent.createdAt =
    const result = await newEvent.save();
    return result.id as string;
  }

  async getEvents() {
    const events = await this.eventModel.find().exec();
    events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    return events.map((eve) => ({
      id: eve.id,
      title: eve.title,
      description: eve.description,
      status: eve.status,
      createdAt: eve.createdAt,
      updatedAt: eve.updatedAt,
      startTime: eve.startTime,
      endTime: eve.endTime,
      invitees: eve.invitees,
    }));
  }

  async getSingleEvent(eventId: string) {
    const event = await this.findEvent(eventId);
    return event; // Return the entire event object
  }

  async updateEvent(eventId: string, eventData: Partial<Event>) {
    const updatedEvent = await this.findEvent(eventId);

    if (eventData.title) {
      updatedEvent.title = eventData.title;
    }
    if (eventData.description) {
      updatedEvent.description = eventData.description;
    }
    if (eventData.status) {
      updatedEvent.status = eventData.status;
    }
    if (eventData.startTime) {
      updatedEvent.startTime = eventData.startTime;
    }
    if (eventData.endTime) {
      updatedEvent.endTime = eventData.endTime;
    }
    if (eventData.invitees) {
      updatedEvent.invitees = eventData.invitees;
    }

    updatedEvent.updatedAt = new Date();
    await updatedEvent.save();
  }

  async deleteEvent(eventId: string) {
    return await this.eventModel.findByIdAndDelete(eventId);
  }

  private async findEvent(id: string): Promise<Event> {
    let event;
    try {
      event = await this.eventModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find Event.');
    }
    if (!event) {
      throw new NotFoundException('Could not find Event.');
    }
    return event;
  }

  async mergeAll() {
    const events = await this.getEvents();
    // events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    // console.log(events);
    let currentEvent: Event | null = null;

    for (const event of events) {
      if (!currentEvent) {
        // First event
        currentEvent = new this.eventModel(event);
      } else if (event.startTime <= currentEvent.endTime) {
        // Overlapping event, merge with current event
        currentEvent.endTime = new Date(
          Math.max(currentEvent.endTime.getTime(), event.endTime.getTime()),
        );
        for (const invitee of event.invitees) {
          if (!currentEvent.invitees.find((i) => i === invitee)) {
            currentEvent.invitees.push(invitee);
          }
        }
      } else {
        // Non-overlapping event, add current event to merged events and start a new current event
        currentEvent.invitees.sort();
        await this.insertEvent(currentEvent);
        currentEvent = new this.eventModel(event);
      }
      // console.log(event.id);
      await this.deleteEvent(event.id);
    }

    // Add last current event to merged events
    if (currentEvent) {
      await this.insertEvent(currentEvent);
    }

    return await this.getEvents();
  }
}
