export interface IUser {
  message: string
  data: {
    username: string;
    email: string;
    hashedPassword: string;
    studentNo: string;
    firstName: string;
    lastName: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
    pictureUrl: string;
    IpAddress: string;
    isActived: boolean;
    allowLogin: boolean;
    isEnable: boolean;
    createdAt: Date;
    updatedAt: Date;
    schoolId: string;
    school: {
      schoolId: string;
      schoolName: string;
    };
    token?: string;
  }
}


