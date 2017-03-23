/*
TTC Dates:

April 4 — May 1, 2017
May 4 — 31, 2017
June 3 — 30, 2017
July 3 — 30, 2017
November 4 — December 1, 2017
December 4 — 31, 2017
January 4 — 31, 2018
February 3 — March 2, 2018
March 7 — April 3, 2018
April 6 — May 3, 2018
May 6 — June 2, 2018
June 5 — July 2, 2018
July 5 — August 1, 2018

A Program is a fixed price over fixed dates that does not require YVP during the time
  - Yoga Vacation Program
  - Experiential Course
  - TTC or ATTC
  - Karma Yoga (???)
A Program can include room

id: YVP, Experiential, TTC, or Karma Yoga
dates: either,
  - an array of pre-defined dates for this program
  - null, which means dates will be input by user
cost: either,
  - fixed number, for a program that has a fixed cost for any of the dates (usually ) fixed number, or function that accepts dates and returns total cost
includesRoom: `true` if room is not needed for these dates

YVP inputs:
  guests: number of adults,
  dates: [ checkIn, checkOut ]
  rooms: [ { dates, roomId }, ... ]

YVP outputs:
room, yvp, total, price per day (room, yvp, total)

Experiential course inputs:
  guests: 1,
  dates: [ courseStart, courseEnd ]
  rooms: [ { dates, roomId }, ... ]
  tuition: dollar amount

Experiential course outputs:
  room, yvp, course, total, price per day (room, yvp, total)

TTC inputs:
  guests: 1,
  dates: [ courseStart, courseEnd ] (prepopulated),
  
*/


