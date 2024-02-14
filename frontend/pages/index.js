import Image from "next/image";
import koslogorough from "../public/images/koslogorough-inverted-transparent.png"

export default function Home() {

  return (
    <div className="homepage-container">
      <div className="logo-wrapper">
        <Image className="logo" src={koslogorough} alt="kos logo" />
      </div>

      <div className="box-rising">
        <div className="wrapper">
          <h1 className="header">Welcome to KOS fitness</h1>
          <p>
            This challenge is about integrity, commitment and brotherhood.
            Everyone who signs up is making a commitment to themselves, their
            families and their friends. If you cheat, you are only cheating
            yourself, no one else.
          </p>
          <p>
            We are here to support each other, to better ourselves, to put our
            bodies to the test, to push our limits, to create better habits and
            to live better lives by being active and taking back what’s ours. We
            are the masters of our fates and the captains of our souls.
          </p>
        </div>
      </div>
      <div className="box-falling">
        <div className="wrapper">
          <h1 className="header">
            I’ll go over some basic rules that must be followed in order to stay
            on this group; if you break them you will be removed. <br /> No
            exceptions.
          </h1>
        </div>
      </div>
      <div className="box-rising">
        <div className="wrapper">
          <ul>
            <li>
              This group is about fitness. Only fitness material is to be
              posted, anything else will get you removed.{" "}
            </li>
            <li>
              Any advertising of any sort must be approved by Bradley
              before posting. You will get removed for doing otherwise;{" "}
              <span className="bold">This is not Amazon.</span>
            </li>
            <li>
              Everyone must participate in the monthly challenges. If you are
              hurt or injured, please let us know ahead of time. If the
              challenge is too hard, you can scale it to your level. Whomever
              does not participate, will be removed.
            </li>
            <li>
              If you miss more than 10 days total over the period of the
              challenge, you will be removed and disqualified from the overall
              prizes; even if you get sick, it won’t matter, this is a
              competition.
            </li>
            <li>
              You can only get credit for 5 days in a week; You are not allowed
              to work out 6 or 7 days the following week to make up for missed
              days.
            </li>
            <li>
              Any information on this group cannot be shared without permission.
              Doing so will get you disqualified and removed.
            </li>
            <li>
              Work will not count as a workout. Active sports will count as a
              workout such as: basketball, volleyball, baseball, etc. Hiking
              will count. Fishing will not count. You are allowed 1 round of
              golf per week to count as a workout. Running through the airport
              will not count. Use good judgement, don’t make us have to tell you
              what a workout is.
            </li>
          </ul>
          <h1 className="header">Entry fees: $210 USD (ages 26 +) | Junior (ages 15-25): $120 USD</h1>
        </div>
      </div>
      <div className="box-falling">
        <div className="wrapper">
          <h1 className="header">We have 2 different groups:</h1>
        </div>
      </div>
      <div className="box-rising">
        <div className="wrapper">
          <ul className="text-center">
            <p>Junior group</p>
            <li>Ages 15-25</li>
            <p>Senior group</p>
            <li>Ages 26+</li>
          </ul>
          <p>
            Every group has two different divisions: Orange ( names that are
            highlighted in orange ) and Blue (names that are highlighted in blue
            ).
          </p>
          <p>
            On all the monthly prizes, you will only be competing against your
            own division; only people whose names are highlighted with your same
            color.
          </p>
          <p>
            On the overall prizes you will be competing with everyone in your
            group.
          </p>
        </div>
      </div>
      <div className="box-falling">
        <div className="wrapper">
          <h1 className="header">
            Each individual group will be competing for:
          </h1>
        </div>
      </div>
      <div className="box-rising">
        <div className="wrapper">
          <ul>
            <li>
              Monthly challenges. These are mandatory, you will be removed if
              you don’t participate (different ones will be posted monthly).
            </li>
            <li>Most consecutive days.</li>
            <li>
              Most improved ( Private message your before pic to AD ).
            </li>
            <li>
              Most weight loss ( Private message video of your weight on scale to AD. ) If you attended the last challenge, we will
              use your ending weight.
            </li>
            <li>Fittest Athlete.</li>
            <li>
              MVP: Most valuable player. The most influential and inspiring
              athlete in the group.
            </li>
            <li>Best plank. Get creative, this is for the entire challenge!</li>
          </ul>
          <h1 className="header">Good luck Athletes!😤</h1>
        </div>
      </div>
    </div>
  );
}
