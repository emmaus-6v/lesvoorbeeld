#ifndef TELLER
#define TELLER

#include <Arduino.h>

class Teller {
  private:
    int pin;
    bool wasOnderbroken;
    unsigned long laatstOnderbroken = 0;
    const int DEBOUNCE_TIME = 10;

    bool wordtOnderbroken() {
      return (wasOnderbroken == false && isOnderbroken() == true);
    }

    int aantal = 0;

  public:
    Teller(int _pin) {
      pinMode(_pin, INPUT_PULLUP);
      pin = _pin;
      wasOnderbroken = false;
    }
    
    bool isOnderbroken() {
      return !digitalRead(pin);
    }

    void update() {
      if (wordtOnderbroken()) {
        if (millis() - laatstOnderbroken > DEBOUNCE_TIME) {
          verhoogAantal();
        } 
      }

      wasOnderbroken = isOnderbroken();
    }

    void verhoogAantal() {
      aantal++;
    }

    int getAantal() {
      return aantal;
    }
};

#endif
