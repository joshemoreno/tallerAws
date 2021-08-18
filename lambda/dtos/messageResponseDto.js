class messageResponseDto {
  constructor(status, code, data, info, request){
    this.status = status;
    this.code = code;
    this.data  = data;
    this.info  = info;
    this.request = request;
  }
};

module.exports = messageResponseDto;
