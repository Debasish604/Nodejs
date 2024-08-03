class CustomErrorHandler extends Error {

    constructor(status,msg)

    {
        super();
        this.status=status;
        this.message=msg | "Some is error";

    }

    static customThrowHandler(status,msg)
    {
        return new CustomErrorHandler(status,msg)
    }
}
module.exports=CustomErrorHandler;