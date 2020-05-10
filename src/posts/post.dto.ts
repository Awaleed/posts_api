import { IsString, IsNumber, IsUrl } from "class-validator";

class CreatePostDto {
  @IsString()
  public title: string;
  @IsString()
  description: string;
  @IsNumber()
  public price: number;
  @IsUrl()
  public image: string;
}

export default CreatePostDto;
