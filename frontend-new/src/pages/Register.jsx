import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Container,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Grid,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import axios from "axios";
import indianStates from "./statesData.js";

// Validation Schema
const validationSchema = yup.object({
    name: yup.string().required("Full Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
    ,
    state: yup.string().required("State is required"),
    district: yup.string().required("District is required"),
    taluka: yup.string().required("Taluka is required"),
    city: yup.string().required("City is required"),
    password: yup.string()
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/\d/, "Must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character")
        .required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    isAdmin: yup.boolean(),
});

const Register = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            dob: "",
            state: "",
            district: "",
            taluka: "",
            city: "",
            address: "",
            password: "",
            confirmPassword: "",
            isAdmin: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log("values", values)
            try {
                const response = await axios.post("http://localhost:5000/api/auth/register", values, {
                    headers: { "Content-Type": "application/json" },
                });
                alert(response.data.message);
                navigate("/login");
            } catch (error) {
                alert(error.response?.data?.error || "Registration failed");
            }
        },
    });

    const handleStateChange = (e) => {
        formik.setFieldValue("state", e.target.value);
        formik.setFieldValue("district", "");
        formik.setFieldValue("taluka", "");
        formik.setFieldValue("city", "");
    };

    const handleDistrictChange = (e) => {
        formik.setFieldValue("district", e.target.value);
        formik.setFieldValue("taluka", "");
        formik.setFieldValue("city", "");
    };

    const handleTalukaChange = (e) => {
        formik.setFieldValue("taluka", e.target.value);
        formik.setFieldValue("city", "");
    };

    const districts = formik.values.state ? indianStates[formik.values.state]?.districts || [] : [];
    const talukas = formik.values.district ? districts.find(d => d.name === formik.values.district)?.talukas || [] : [];
    const cities = formik.values.taluka ? talukas.find(t => t.name === formik.values.taluka)?.cities || [] : [];

    return (
        <Container maxWidth="md" sx={{ mt: 8, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: "#fff" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Register
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate autoComplete="off">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField name="name" label="Full Name" fullWidth {...formik.getFieldProps("name")} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} required />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField name="email" label="Email" type="email" fullWidth {...formik.getFieldProps("email")} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} required />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField name="phone" label="Phone" type="tel" fullWidth {...formik.getFieldProps("phone")} error={formik.touched.phone && Boolean(formik.errors.phone)} helperText={formik.touched.phone && formik.errors.phone} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            name="dob"
                            label="Date of Birth"
                            type="date"
                            fullWidth
                            value={formik.values.dob || ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            InputLabelProps={{ shrink: true }}
                            error={formik.touched.dob && Boolean(formik.errors.dob)}
                            helperText={formik.touched.dob && formik.errors.dob}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth error={formik.touched.state && Boolean(formik.errors.state)}>
                            <InputLabel>State</InputLabel>
                            <Select name="state" value={formik.values.state} onChange={handleStateChange}>
                                {Object.keys(indianStates).map(state => (
                                    <MenuItem key={state} value={state}>{state}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth error={formik.touched.district && Boolean(formik.errors.district)}>
                            <InputLabel>District</InputLabel>
                            <Select name="district" value={formik.values.district} onChange={handleDistrictChange}>
                                {districts.map(district => (
                                    <MenuItem key={district.name} value={district.name}>{district.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth error={formik.touched.taluka && Boolean(formik.errors.taluka)}>
                            <InputLabel>Taluka</InputLabel>
                            <Select name="taluka" value={formik.values.taluka} onChange={handleTalukaChange}>
                                {talukas.map(taluka => (
                                    <MenuItem key={taluka.name} value={taluka.name}>{taluka.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth error={formik.touched.city && Boolean(formik.errors.city)}>
                            <InputLabel>City/Village</InputLabel>
                            <Select name="city" value={formik.values.city} onChange={formik.handleChange}>
                                {cities.map(city => (
                                    <MenuItem key={city} value={city}>{city}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField name="address" label="Address" fullWidth {...formik.getFieldProps("address")} error={formik.touched.name && Boolean(formik.errors.address)} helperText={formik.touched.address && formik.errors.address} />

                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField name="password" label="Password" type="password" fullWidth {...formik.getFieldProps("password")} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} required />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField name="confirmPassword" label="Confirm Password" type="password" fullWidth {...formik.getFieldProps("confirmPassword")} error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} required />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox name="isAdmin" checked={formik.values.isAdmin} onChange={formik.handleChange} />} label="Register as Admin" />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth type="submit">
                            Register
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Register;
