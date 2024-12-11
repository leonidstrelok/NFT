import React, { useState } from 'react'
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { TextField, Button } from '@mui/material';
import register from '../api/back/register';
import { useWallet } from '@solana/wallet-adapter-react';

const buttonRootStyle = {
    padding: '4px 32px',

    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '42px',
    /* identical to box height, or 262% */

    letterSpacing: '0.744416px',

    color: '#FFFFFF',
    borderRadius: '8px',

    textTransform: 'none !important',
};

export default function Register() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { publicKey } = useWallet();

    const handleSubmit = async () => {
        const res = await register(userName, email, password, localStorage.getItem("referal"), [publicKey.toString()]);
    }
    return (
        <>
            <Head>
                <title>GOLDOR | Register</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <Header current={2} />
            <div className="content-page">
                <div className="content-page__register">
                    <div className="content-page__register-container">
                        <form className="content-page__register-form" onSubmit={handleSubmit}>
                            <div className="content-page__form-block">
                                <h4 className="content-page__form_required">Username</h4>
                                <div className="form-input">
                                    <TextField
                                        placeholder="Username"
                                        name="name"
                                        required
                                        sx={{
                                            '.MuiOutlinedInput-input': {
                                                paddingLeft: '20px',
                                                paddingTop: '4px',
                                                paddingBottom: '4px',
                                                fontSize: '16px',
                                                lineHeight: '42px',
                                                height: '42px',
                                            },
                                        }}
                                        onChange={(e) => setUserName(e.target.value)}
                                        value={userName}
                                    ></TextField>
                                </div>
                            </div>
                            <div className="content-page__form-block">
                                <h4 className="content-page__form_required">Email</h4>
                                <div className="form-input">
                                    <TextField
                                        placeholder="Email"
                                        name="name"
                                        required
                                        sx={{
                                            '.MuiOutlinedInput-input': {
                                                paddingLeft: '20px',
                                                paddingTop: '4px',
                                                paddingBottom: '4px',
                                                fontSize: '16px',
                                                lineHeight: '42px',
                                                height: '42px',
                                            },
                                        }}
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                    ></TextField>
                                </div>
                            </div>
                            <div className="content-page__form-block">
                                <h4 className="content-page__form_required">Password</h4>
                                <div className="form-input">
                                    <TextField
                                        placeholder="Password"
                                        name="name"
                                        type="password"
                                        required
                                        sx={{
                                            '.MuiOutlinedInput-input': {
                                                paddingLeft: '20px',
                                                paddingTop: '4px',
                                                paddingBottom: '4px',
                                                fontSize: '16px',
                                                lineHeight: '42px',
                                                height: '42px',
                                            },
                                        }}
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                    ></TextField>
                                </div>
                            </div>
                            <div className="content-page__form-block">
                                <div className="form-input">
                                    <Button
                                        variant="contained"
                                        sx={{
                                            ...buttonRootStyle,
                                            minWidth: '189px',
                                            background:
                                                'linear-gradient(141.56deg, #365FFA -4.76%, #A736E0 120.26%) !important',
                                        }}
                                        type="submit"
                                    >
                                        Register
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
