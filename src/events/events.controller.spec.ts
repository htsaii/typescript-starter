import { Test, TestingModule } from '@nestjs/testing';
import { Event } from './event.model';
import { getModelToken } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { EventsController } from './events.controller';

describe('EventsController', () => {
  let eventService: EventsService;
  let eventController: EventsController;

  const mockEvent = {
    id: '653adec2fc82596d0a9d0083',
    title: 'Sample Event 6',
    description: 'Event 6',
    status: 'TODO',
    createdAt: new Date('2023-10-26T21:48:50.071Z'),
    updatedAt: new Date('2023-10-27T05:26:52.695Z'),
    startTime: new Date('2021-12-31T08:00:00.000Z'),
    endTime: new Date('2022-01-01T12:20:00.000Z'),
    invitees: [],
  };

  const mockEvents = [
    {
      id: '653adec2fc82596d0a9d0083',
      title: 'Sample Event 1',
      description: 'Event 1',
      status: 'TODO',
      createdAt: new Date('2023-10-26T21:48:50.071Z'),
      updatedAt: new Date('2023-10-27T05:26:52.695Z'),
      startTime: new Date('2021-12-31T08:00:00.000Z'),
      endTime: new Date('2022-01-01T12:20:00.000Z'),
      invitees: [],
    },
    {
      id: '653ad8473f621288b3f0b817',
      title: 'Sample Event 2',
      description: 'Event 2',
      status: 'TODO',
      createdAt: new Date('2023-10-26T21:48:50.071Z'),
      updatedAt: new Date('2023-10-27T05:26:52.695Z'),
      startTime: new Date('2022-01-01T08:00:00.000Z'),
      endTime: new Date('2022-01-01T12:20:00.000Z'),
      invitees: [],
    },
    {
      id: '653ada3ab3a6ef384bb25128',
      title: 'Sample Event 3',
      description: 'Event 3',
      status: 'TODO',
      createdAt: new Date('2023-10-26T21:48:50.071Z'),
      updatedAt: new Date('2023-10-27T05:26:52.695Z'),
      startTime: new Date('2022-01-01T09:00:00.000Z'),
      endTime: new Date('2022-01-02T00:00:00.000Z'),
      invitees: [],
    },
    {
      id: '653ada3ab3a6ef384bb25130',
      title: 'Sample Event 4',
      description: 'Event 4',
      status: 'TODO',
      createdAt: new Date('2023-10-26T21:48:50.071Z'),
      updatedAt: new Date('2023-10-27T05:26:52.695Z'),
      startTime: new Date('2023-12-31T18:00:00.000Z'),
      endTime: new Date('2024-01-01T12:20:00.000Z'),
      invitees: [],
    },
  ];

  const mockEventService = {
    getEvents: jest.fn().mockResolvedValueOnce(mockEvents),
    deleteEvent: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    eventService = module.get<EventsService>(EventsService);
    eventController = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(eventController).toBeDefined();
  });

  describe('getAllEvents', () => {
    it('should return an array of events', async () => {
      const result = await eventController.getAllEvents();
      expect(result).toEqual(mockEvents);
      expect(eventService.getEvents).toHaveBeenCalled();
    });
  });

  describe('removeEvent', () => {
    it('should delete an event', async () => {
      const result = await eventController.removeEvent(mockEvent.id);
      expect(result).toEqual({ deleted: true });
      expect(eventService.deleteEvent).toHaveBeenCalledWith(mockEvent.id);
    });
  });
});
