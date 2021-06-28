import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  grids: string[][];
  days: any[][];
  times: number[];
  stringTimes: string[] = [];
  stringDays: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  selectedTime: number[] = [];
  selectedDay: number = -1;
  message: string = '';
  isAddSessionModalOpen: boolean = false;

  private noOfTimes = 17;
  private noOfDays = 7;

  constructor(
  ){
    this.grids = this.generateGridsAndTimes();
    this.days = this.generateDays();
    this.times = this.generateTimes();
  }

  /**
   * Generates grids and times
   * 
   * @returns string[][]
   */
  generateGridsAndTimes(){
    let result = [["", ...this.stringDays]];
    let currHour = 9, currMinute = 0;
    let currTime = "";
    
    for(let i=0; i<17;i++){
      currTime = `${currHour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:\
                  ${currMinute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;

      result.push([currTime, "", "", "", "", "", "", ""]);
      this.stringTimes.push(currTime);
      if(currMinute == 0){
        currMinute = 30;
      } else {
        currHour++;
        currMinute = 0;
      }
    }
    return result;
  }

  /**
   * Generates time for sidebar
   * 
   * @returns number[]
   */
  generateTimes(){
    let times = [];
    for(let i=0; i<this.noOfTimes; i++){
      times.push(i)
    }
    return times;
  }

  /**
   * Adds time to selected time when time on sidebar is clicked.
   * 
   * @param index index that is clicked
   */
  handleTimeClick(index: number){
    
    this.selectedTime.push(index);
    this.selectedTime.sort((a, b) => a-b);
    
    if(this.selectedTime.length == 2){
      this.toggleModal();
    } 
  }
  
  /**
   * Finds a suitable track in the corresponding day to
   * add the session to, adds new track to the day if no
   * suitable track
   */
  addSession(){
    if(this.selectedDay == -1){
      this.closeAddSessionModal();
      return;
    }

    let day = this.days[this.selectedDay];
    let startTime = this.selectedTime[0], endTime = this.selectedTime[1];
    let track, hasConflict;

    for(let i=0; i<day.length; i++){
      track = day[i];
      hasConflict = false;
      for(let j=startTime; j<endTime+1; j++){
        if(track[j] != 0){
          hasConflict = true;
          break;
        }
      }

      if(hasConflict){
        if(i == day.length-1){
          day.push(this.generateEmptyTrack(this.noOfTimes));
        }else{
          continue;
        }
      }else{
        this.addSessionToTrack(track, startTime, endTime, this.message);
        break;
      }
    }

    this.closeAddSessionModal();
  }

  /**
   * Adds the session to the track
   * 
   * @param track 
   * @param startTime 
   * @param endTime 
   * @param message 
   */
  addSessionToTrack(track: any[], startTime: number, endTime: number, message: string){
    let session = {length: endTime-startTime+1, 
                  startTime: startTime, 
                  message: message,
                  color: '#'+Math.random().toString(16).substr(2,6)};

    track[startTime] = session;

    for(let i=startTime+1; i<endTime+1; i++){
      track[i] = 1;
    }
  }
  
  /**
   * Handles closing of the add session modal
   */
  closeAddSessionModal(){
    this.clearModalData();
    this.toggleModal();
  }

  /**
   * Resets all modal data and highlighted times
   */
  clearModalData(){
    this.selectedTime = [];
    this.selectedTime.length = 0;

    this.selectedDay = -1;
    this.message = '';
  }

  /**
   * Toggles modal open and close
   */
  toggleModal(){
    this.isAddSessionModalOpen = !this.isAddSessionModalOpen;
  }

  /**
   * @param index index of time
   * @returns {string} color to highlight the cell
   */
  highlightCell(index: number){
    let result = "transparent";
    if(this.selectedTime.indexOf(index) != -1 && this.selectedTime.length == 1){
      result = 'blue'
    }else if(this.selectedTime.length == 2 && this.selectedTime[0] <= index && index <= this.selectedTime[1]){
      result = 'blue'
    }

    return  result;
  }

  /**
   * Generates all the days of the week and prefills them with 1 empty track each
   * 
   * @returns {any[][]} list of days which contain tracks
   */
  generateDays(){
    let days = [];
    let day;

    for(let i=0; i<this.noOfDays; i++){
      day = [this.generateEmptyTrack(this.noOfTimes)];
      days.push(day);
    }

    return days;
  }

  /**
   * Generates empty track
   * 
   * @param length length of track (timeslots)
   * @returns {any[]} track which contains session objects and numbers
   */
  generateEmptyTrack(length: number){
    let track = [];
    
    for(let i=0; i<length; i++){
      track.push(0);
    }

    return track;
  }

  /**
   * Checks whether session is valid
   * 
   * @param session session object
   * @returns {boolean} 
   */
  isValidSession(session: any){
    return typeof(session) === 'object';
  }
}
