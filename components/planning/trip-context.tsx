'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SAVED_TRIPS, SavedTrip } from './saved-trips';

interface TripContextType {
  savedTrips: SavedTrip[];
  addTrip: (trip: SavedTrip) => void;
  updateTrip: (trip: SavedTrip) => void;
  deleteTrip: (tripId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(SAVED_TRIPS);

  // Load saved trips from localStorage on initial render
  useEffect(() => {
    const storedTrips = localStorage.getItem('savedTrips');
    if (storedTrips) {
      try {
        const parsedTrips = JSON.parse(storedTrips);
        // Only update if we have trips in localStorage
        if (Array.isArray(parsedTrips) && parsedTrips.length > 0) {
          setSavedTrips(parsedTrips);
        } else {
          // If localStorage is empty, initialize it with our mock data
          localStorage.setItem('savedTrips', JSON.stringify(SAVED_TRIPS));
        }
      } catch (error) {
        console.error('Error parsing saved trips from localStorage:', error);
        // If there's an error, reset localStorage with our mock data
        localStorage.setItem('savedTrips', JSON.stringify(SAVED_TRIPS));
      }
    } else {
      // If no data in localStorage, initialize it with our mock data
      localStorage.setItem('savedTrips', JSON.stringify(SAVED_TRIPS));
    }
  }, []);

  // Save trips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedTrips', JSON.stringify(savedTrips));
  }, [savedTrips]);

  const addTrip = (trip: SavedTrip) => {
    setSavedTrips((prevTrips) => {
      // Check if trip with same ID already exists
      const existingTripIndex = prevTrips.findIndex(t => t.id === trip.id);

      let newTrips;
      if (existingTripIndex >= 0) {
        // Update existing trip
        const updatedTrips = [...prevTrips];
        updatedTrips[existingTripIndex] = {
          ...trip,
          updatedAt: new Date().toISOString()
        };
        newTrips = updatedTrips;
      } else {
        // Add new trip
        newTrips = [...prevTrips, {
          ...trip,
          createdAt: trip.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }];
      }

      // Immediately update localStorage
      localStorage.setItem('savedTrips', JSON.stringify(newTrips));
      return newTrips;
    });
  };

  const updateTrip = (trip: SavedTrip) => {
    setSavedTrips((prevTrips) => {
      const updatedTrips = prevTrips.map(t =>
        t.id === trip.id
          ? { ...trip, updatedAt: new Date().toISOString() }
          : t
      );

      // Immediately update localStorage
      localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
      return updatedTrips;
    });
  };

  const deleteTrip = (tripId: string) => {
    setSavedTrips((prevTrips) => {
      const filteredTrips = prevTrips.filter(trip => trip.id !== tripId);

      // Immediately update localStorage
      localStorage.setItem('savedTrips', JSON.stringify(filteredTrips));
      return filteredTrips;
    });
  };

  return (
    <TripContext.Provider value={{ savedTrips, addTrip, updateTrip, deleteTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
