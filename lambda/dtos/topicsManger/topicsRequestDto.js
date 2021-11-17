class topicsRequestDto {
  constructor(name, schedulingDate, responsibleName){
    var currentDate = new Date().toISOString();

    this.id = "";
    this.name = name;
    this.schedulingDate = schedulingDate;
    this.responsibleName = responsibleName;
    this.topicStatus = "";
  }

  isLoad(info){
    this.name = info.name ? info.name : "";
    this.schedulingDate = info.schedulingDate ? info.schedulingDate : "";
    this.responsibleName = info.responsibleName ? info.responsibleName : "";

    return this.name != "" && this.name != undefined &&
          this.schedulingDate != "" && this.schedulingDate != undefined &&
          this.responsibleName != "" && this.responsibleName != undefined; 
  }
};

module.exports = topicsRequestDto;