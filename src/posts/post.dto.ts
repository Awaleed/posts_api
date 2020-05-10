import { IsString, isNumber, IsDecimal, IsNumber, IsUrl } from "class-validator";

class CreatePostDto {
  @IsString()
  public author: string;
  @IsNumber()
  public price: number;
  @IsUrl()
  public image: string;
  @IsString()
  public title: string;
}

export default CreatePostDto;
