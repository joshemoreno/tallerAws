class assistanceRequestDto {
  constructor(id, topic){

    this.id = id;
    this.topic = topic;
  }

  isLoad(info){
    this.id = info.id ? info.id : "";
    this.topic = info.topic ? info.topic : "";

    return this.id != "" && this.id != undefined &&
           this.topic != "" && this.topic != undefined; 
  }
};

module.exports = assistanceRequestDto;