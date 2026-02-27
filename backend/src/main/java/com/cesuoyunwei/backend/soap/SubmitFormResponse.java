package com.cesuoyunwei.backend.soap;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "SubmitFormResponse", namespace = "http://cesuoyunwei.com/forms")
@XmlAccessorType(XmlAccessType.FIELD)
public class SubmitFormResponse {
    public Long submissionId;
}
