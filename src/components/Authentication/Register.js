import { Form, Input, Button, Alert } from 'antd';
import { useRef, useState } from 'react';
import { getUserDetails, register } from '../../actions/auth';
import OtpModal from '../OtpPage/otpModal';
import { useNavigate } from 'react-router-dom';
import { sendPhoneVerificationCode } from '../../actions/otp';

export const Register = () => {

    const navigate = useNavigate()

    const [error, setError] = useState()
    const phoneRef = useRef()


    function handleSendCodeVerfication() {
        let phone = phoneRef.current.input.value
        sendPhoneVerificationCode(phone)
    }

    // async function handleRegister(phoneVerificationCode) {
    async function handleRegister(registerDetails) {
        setError(null)
        const response = await register(registerDetails)
        if (!response.ok) {
            setError(await response.text())
        } else {
            // אם הוא מצליח להירשם הוא מכניס לתוקן את היוזר
            getUserDetails()
            //נשנה את זה בעתיד
            navigate("/login")

        }
    }

    return (
        <div>
            {error && <Alert type="error">{error}</Alert>}
            <Form onFinish={handleRegister}>
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'כתובת לא תקינה',
                        },
                        {
                            required: true,
                            message: 'הכנס כתובת אימייל',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="סיסמא"
                    rules={[
                        {
                            required: true,
                            message: 'בחר סיסמא!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="אשר סיסמא"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'הכנס שוב את הסיסמא שבחרת',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('הסיסמאות אינן תואמות! נסה שוב'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="שם מלא"
                    tooltip="שם פרטי ושם משפחה"
                    rules={[{ required: true, message: 'הכנס שם מלא', whitespace: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="טלפון"
                    tooltip="מספר טלפון ליצירת קשר ואימות סיסמא"
                    rules={[{ required: true, message: 'הכנס מספר טלפון', whitespace: true }]}
                >
                    <Input ref={phoneRef} />
                </Form.Item>
                <Button onClick={handleSendCodeVerfication}>
                    שלח קוד אימות לטלפון
                </Button>
                <Form.Item
                    name="code"
                    label="קוד אימות"
                    tooltip="קוד הנשלח בהודעה לטלפון"
                    rules={[{ required: true, message: "עליך להזין קוד אימות" }]}
                >
                    <Input type="number" />


                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" >
                        הירשם
                    </Button>
                </Form.Item>
            </Form>
        </div>)
}