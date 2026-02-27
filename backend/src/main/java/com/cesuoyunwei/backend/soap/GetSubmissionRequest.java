package com.cesuoyunwei.backend.soap;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "GetSubmissionRequest", namespace = "http://cesuoyunwei.com/forms")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetSubmissionRequest {
    public Long id;
}
