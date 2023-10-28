import { Test, TestingModule } from '@nestjs/testing';
import { Event } from './event.model';
import { getModelToken } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let eventsService: EventsService;
  let model: Model<Event>;

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
    find: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: mockEventService,
        },
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
    model = module.get<Model<Event>>(getModelToken(Event.name));
  });

  describe('removeEvent', () => {
    it('should delete an event', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockEvent);

      const result = await eventsService.deleteEvent(mockEvent.id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockEvent.id);

      expect(result).toEqual(mockEvent);
    });
  });

  describe('getEvents', () => {
    it('should return all events', async () => {
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            exec: jest.fn().mockResolvedValue(mockEvents),
          } as any),
      );

      const result = await eventsService.getEvents();

      expect(model.find).toHaveBeenCalled();

      expect(result).toEqual(mockEvents);
    });
  });

  describe('getSingleEvent', () => {
    it('should return a single event by ID', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(mockEvent);

      const result = await eventsService.getSingleEvent(mockEvent.id);

      expect(model.findById).toHaveBeenCalledWith(mockEvent.id);
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if the event is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValueOnce(null);

      await expect(eventsService.getSingleEvent(mockEvent.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockEvent.id);
    });
  });
});
