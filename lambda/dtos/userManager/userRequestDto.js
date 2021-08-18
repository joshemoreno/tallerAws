class userRequestDto {
  constructor(id, name, lastName, role, status){
    var currentDate = new Date().toISOString();

    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.role = role;
    this.status = status;
    this.registerDate = currentDate;
  }

  isLoad(info){
    this.id = info.id ? info.id : "";
    this.name = info.name ? info.name : "";
    this.lastName = info.lastName ? info.lastName : "";
    this.role = info.role ? info.role : "";
    this.status = info.status ? info.status : "";

    return this.id != "" && this.id != undefined &&
          this.name != "" && this.name != undefined &&
          this.lastName != "" && this.lastName != undefined &&
          this.role != "" && this.role != undefined &&
          this.status != "" && this.status != undefined; 
  }
};

module.exports = userRequestDto;