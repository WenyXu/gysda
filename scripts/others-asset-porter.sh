#!/bin/bash
for param in "$@"; do
case $param in
    -e=*|--environment=*)
    ENVIRONMENT="${param#*=}"
    ;;
    *)
    ;;
esac; done

prefix="/home/travis/build/liuliangsir"
if [[ "$ENVIRONMENT" == "local" ]]; then
    prefix="${HOME}/Desktop/project"
fi

mv $prefix/gysda/CNAME $prefix/gysda/app/dist
