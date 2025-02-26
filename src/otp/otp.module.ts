import {Module} from '@nestjs/common';
import {OtpService} from './otp.service';
import {OtpSchema, Otp} from 'src/otp/schemas/otp.schema';
import {MongooseModule} from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: Otp.name, schema: OtpSchema}])],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
